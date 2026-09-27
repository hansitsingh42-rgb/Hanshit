"use strict";

const crypto = require("node:crypto");
const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");
const { isUuid, isPlainObject, boundedString } = require("../../lib/input-validation");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });

  const data = req.body && typeof req.body === "object" ? req.body : {};
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const name = typeof data.name === "string" ? data.name.trim().slice(0, 120) : "";
  const consent = data.consent === true;
  const segmentId = typeof data.segmentId === "string" ? data.segmentId.trim() : "";
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk || email.length > 320 || !segmentId || !uuid.test(segmentId) || !consent) {
    return res.status(400).json({ error: "Contact details are invalid." });
  }

  let client;
  try {
    client = await getClient();
    const session = await client.query(
      "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
      [hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: "Authentication required." });
    const userId = session.rows[0].user_id;

    const segment = await client.query(
      "SELECT id FROM audience_segments WHERE id=$1 AND user_id=$2 LIMIT 1",
      [segmentId, userId]
    );
    if (!segment.rows[0]) return res.status(404).json({ error: "Audience segment not found." });

    await client.query("BEGIN");
    const existing = await client.query(
      "SELECT id,status FROM audience_contacts WHERE user_id=$1 AND email=$2 LIMIT 1",
      [userId, email]
    );

    let contact;
    if (existing.rows[0]) {
      if (existing.rows[0].status !== "subscribed") {
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "This contact is not eligible for subscription." });
      }
      contact = existing.rows[0];
      await client.query(
        "UPDATE audience_contacts SET name=COALESCE(NULLIF($1,''),name),updated_at=NOW() WHERE id=$2 AND user_id=$3",
        [name, contact.id, userId]
      );
    } else {
      const created = await client.query(
        "INSERT INTO audience_contacts(id,user_id,email,name,status,consent_at) VALUES($1,$2,$3,$4,'subscribed',NOW()) RETURNING id,email,name,status,consent_at",
        [crypto.randomUUID(), userId, email, name || null]
      );
      contact = created.rows[0];
    }

    await client.query(
      "INSERT INTO audience_segment_contacts(segment_id,contact_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
      [segmentId, contact.id]
    );
    await client.query("COMMIT");

    return res.status(201).json({ contact: { id: contact.id, email: contact.email, name: contact.name, status: contact.status } });
  } catch (error) {
    try { await client?.query("ROLLBACK"); } catch {}
    if (error?.code === "23505") return res.status(409).json({ error: "Contact already exists." });
    return res.status(503).json({ error: "Contact service unavailable." });
  } finally {
    client?.release();
  }
};
