"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");

async function getUserId(client, req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["__Host-ecb_session"];
  if (!token) return null;
  const result = await client.query(
    "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
    [hashToken(token)]
  );
  return result.rows[0] ? result.rows[0].user_id : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let client;
  try {
    client = await getClient();
    const userId = await getUserId(client, req);
    if (!userId) return res.status(401).json({ error: "Authentication required." });

    const result = await client.query(
      "SELECT id,name,subject_line,audience,status,scheduled_at,created_at,updated_at FROM campaigns WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100",
      [userId]
    );
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ campaigns: result.rows });
  } catch {
    return res.status(503).json({ error: "Campaign service unavailable." });
  } finally {
    client?.release();
  }
};
