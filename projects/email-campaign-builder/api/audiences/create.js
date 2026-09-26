"use strict";

const crypto = require("node:crypto");
const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const data = req.body && typeof req.body === "object" ? req.body : {};
  const name = typeof data.name === "string" ? data.name.trim().slice(0, 80) : "";
  const source = typeof data.source === "string" ? data.source.trim().slice(0, 80) : "";
  const condition = typeof data.condition === "string" ? data.condition.trim().slice(0, 120) : "";
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
