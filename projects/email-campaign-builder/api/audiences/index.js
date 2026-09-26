"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  let client;
  try {
    client = await getClient();
    const session = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: "Authentication required." });

    const result = await client.query(
      "SELECT id,name,source,condition,created_at FROM audience_segments WHERE user_id=$1 ORDER BY created_at DESC",
      [session.rows[0].user_id]
    );
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ audiences: result.rows });
  } catch {
    return res.status(503).json({ error: "Audience service unavailable." });
  } finally {
    client?.release();
  }
};
