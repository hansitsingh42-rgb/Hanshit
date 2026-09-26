"use strict";

const { parseCookies, hashToken, getClient, sameOriginRequest } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!sameOriginRequest(req)) return res.status(403).json({ error: "Request validation failed." });
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Invalid campaign id." });

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const data = req.body && typeof req.body === "object" ? req.body : {};
  const name = typeof data.name === "string" ? data.name.trim().slice(0, 120) : "";
  const subjectLine = typeof data.subjectLine === "string" ? data.subjectLine.trim().slice(0, 180) : "";
  const audience = typeof data.audience === "string" ? data.audience.trim().slice(0, 120) : "";
  if (!name || !subjectLine || !audience) return res.status(400).json({ error: "Campaign fields are invalid." });

  let client;
  try {
    client = await getClient();
    const session = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: "Authentication required." });

    const result = await client.query(
      "UPDATE campaigns SET name=$1,subject_line=$2,audience=$3,updated_at=NOW() WHERE id=$4 AND user_id=$5 RETURNING id,name,subject_line,audience,status,scheduled_at,created_at,updated_at",
      [name, subjectLine, audience, id, session.rows[0].user_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Campaign not found." });
    return res.status(200).json({ campaign: result.rows[0] });
  } catch {
    return res.status(503).json({ error: "Campaign service unavailable." });
  } finally {
    client?.release();
  }
};