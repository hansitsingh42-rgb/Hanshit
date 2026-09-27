"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { issueCsrf } = require("../../lib/request-security");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies["__Host-ecb_session"];
  if (!sessionToken) return res.status(401).json({ error: "Authentication required." });

  let client;
  try {
    client = await getClient();
    const result = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(sessionToken)]
    );
    if (!result.rows[0]) return res.status(401).json({ error: "Authentication required." });

    const token = issueCsrf(res);
    return res.status(200).json({ token });
  } catch {
    return res.status(503).json({ error: "Security service unavailable." });
  } finally {
    client?.release();
  }
};
