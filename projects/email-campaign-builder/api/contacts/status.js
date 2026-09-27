"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");
const { isUuid, isPlainObject, boundedString } = require("../../lib/input-validation");
const { allow, clientKey } = require("../../lib/rate-limit");

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });
  if (!allow(clientKey(req, "contact-status"), 60, 60 * 60 * 1000)) return res.status(429).json({ error: "Too many contact status requests." });

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const id = typeof req.query?.id === "string" ? req.query.id.trim() : "";
  if (!isUuid(id)) return res.status(400).json({ error: "Contact is invalid." });

  const data = isPlainObject(req.body) ? req.body : {};
  const status = boundedString(data.status, 20) || "";
  if (!["subscribed","unsubscribed","suppressed"].includes(status)) {
    return res.status(400).json({ error: "Contact status is invalid." });
  }

  let client;
  try {
    client = await getClient();
    const session = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: "Authentication required." });

    const result = await client.query(
      "UPDATE audience_contacts SET status=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING id,email,name,status",
      [status, id, session.rows[0].user_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Contact not found." });
    return res.status(200).json({ contact: result.rows[0] });
  } catch {
    return res.status(503).json({ error: "Contact service unavailable." });
  } finally {
    client?.release();
  }
};
