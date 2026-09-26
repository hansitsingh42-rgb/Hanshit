"use strict";

const crypto = require("node:crypto");
const { parseCookies, hashToken, getClient, sameOriginRequest } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!sameOriginRequest(req)) return res.status(403).json({ error: "Request validation failed." });

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const data = req.body && typeof req.body === "object" ? req.body : {};
  const name = typeof data.name === "string" ? data.name.trim().slice(0, 120) : "";
  const subjectLine = typeof data.subjectLine === "string" ? data.subjectLine.trim().slice(0, 180) : "";
  const audience = typeof data.audience === "string" ? data.audience.trim().slice(0, 120) : "";
  const status = data.status === "scheduled" ? "scheduled" : "draft";
  if (!name || !subjectLine || !audience) return res.status(400).json({ error: "Campaign fields are invalid." });

  let client;
  try {
    client = await getClient();
    const user = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!user.rows[0]) return res.status(401).json({ error: "Authentication required." });

    const result = await client.query(
      "INSERT INTO campaigns(id,user_id,name,subject_line,audience,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,name,subject_line,audience,status,created_at,updated_at",
      [crypto.randomUUID(), user.rows[0].user_id, name, subjectLine, audience, status]
    );
    return res.status(201).json({ campaign: result.rows[0] });
  } catch {
    return res.status(503).json({ error: "Campaign service unavailable." });
  } finally {
    client?.release();
  }
};