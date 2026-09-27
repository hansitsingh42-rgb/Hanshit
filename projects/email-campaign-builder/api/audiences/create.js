"use strict";

const crypto = require("node:crypto");
const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");
const { boundedString, isPlainObject } = require("../../lib/input-validation");
const { allow, clientKey } = require("../../lib/rate-limit");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });
  if (!allow(clientKey(req, "audience-create"), 30, 60 * 60 * 1000)) return res.status(429).json({ error: "Too many audience creation requests." });

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const data = isPlainObject(req.body) ? req.body : {};
  const name = boundedString(data.name, 80, { required: true }) || "";
  const source = boundedString(data.source, 80, { required: true }) || "";
  const condition = boundedString(data.condition, 120, { required: true }) || "";
  if (!name || !source || !condition) return res.status(400).json({ error: "Audience fields are invalid." });

  let client;
  try {
    client = await getClient();
    const session = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: "Authentication required." });

    const result = await client.query(
      "INSERT INTO audience_segments(id,user_id,name,source,condition) VALUES($1,$2,$3,$4,$5) RETURNING id,name,source,condition,created_at",
      [crypto.randomUUID(), session.rows[0].user_id, name, source, condition]
    );
    return res.status(201).json({ audience: result.rows[0] });
  } catch (error) {
    if (error?.code === "23505") return res.status(409).json({ error: "An audience with this name already exists." });
    return res.status(503).json({ error: "Audience service unavailable." });
  } finally {
    client?.release();
  }
};
