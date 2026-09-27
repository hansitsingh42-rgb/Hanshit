"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["__Host-ecb_session"];
  if (!token) return res.status(401).json({ authenticated: false });

  let client;
  try {
    client = await getClient();
    const result = await client.query(
      "SELECT u.id, u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!result.rows[0]) return res.status(401).json({ authenticated: false });
    return res.status(200).json({ authenticated: true, user: { id: result.rows[0].id, email: result.rows[0].email } });
  } catch {
    return res.status(503).json({ error: "Authentication service unavailable." });
  } finally {
    client?.release();
  }
};
