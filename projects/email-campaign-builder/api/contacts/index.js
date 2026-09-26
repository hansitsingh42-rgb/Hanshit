"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const segmentId = typeof req.query?.segmentId === "string" ? req.query.segmentId.trim() : "";
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (segmentId && !uuid.test(segmentId)) return res.status(400).json({ error: "Audience segment is invalid." });

  let client;
  try {
    client = await getClient();
    const session = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: "Authentication required." });
    const userId = session.rows[0].user_id;

    const result = segmentId
      ? await client.query(
          `SELECT c.id,c.email,c.name,c.status,c.consent_at,c.created_at
           FROM audience_contacts c
           JOIN audience_segment_contacts sc ON sc.contact_id=c.id
           JOIN audience_segments s ON s.id=sc.segment_id
           WHERE c.user_id=$1 AND s.user_id=$1 AND s.id=$2
           ORDER BY c.created_at DESC`,
          [userId, segmentId]
        )
      : await client.query(
          "SELECT id,email,name,status,consent_at,created_at FROM audience_contacts WHERE user_id=$1 ORDER BY created_at DESC",
          [userId]
        );

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ contacts: result.rows });
  } catch {
    return res.status(503).json({ error: "Contact service unavailable." });
  } finally {
    client?.release();
  }
};
