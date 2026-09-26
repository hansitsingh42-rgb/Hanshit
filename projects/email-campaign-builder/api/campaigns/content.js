"use strict";

const { parseCookies, hashToken, getClient, sameOriginRequest } = require("../../lib/auth");

function idFromRequest(req) {
  const id = typeof req.query?.id === "string" ? req.query.id : "";
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null;
}

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function authenticatedUser(client, req) {
  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return null;
  const result = await client.query(
    "SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",
    [hashToken(token)]
  );
  return result.rows[0]?.user_id || null;
}

module.exports = async function handler(req, res) {
  const id = idFromRequest(req);
  if (!id) return res.status(400).json({ error: "Invalid campaign id." });
  if (!["GET", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (req.method === "PATCH" && !sameOriginRequest(req)) {
    return res.status(403).json({ error: "Request validation failed." });
  }

  let client;
  try {
    client = await getClient();
    const userId = await authenticatedUser(client, req);
    if (!userId) return res.status(401).json({ error: "Authentication required." });

    if (req.method === "GET") {
      const result = await client.query(
        "SELECT id,template,headline,body_text,cta_text FROM campaigns WHERE id=$1 AND user_id=$2 LIMIT 1",
        [id, userId]
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Campaign not found." });
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ content: result.rows[0] });
    }

    const data = req.body && typeof req.body === "object" ? req.body : {};
    const template = text(data.template, 80);
    const headline = text(data.headline, 120);
    const bodyText = text(data.body, 3000);
    const ctaText = text(data.cta, 40);
    if (!template || !headline || !bodyText) {
      return res.status(400).json({ error: "Email content is invalid." });
    }

    const result = await client.query(
      "UPDATE campaigns SET template=$1,headline=$2,body_text=$3,cta_text=$4,updated_at=NOW() WHERE id=$5 AND user_id=$6 RETURNING id,template,headline,body_text,cta_text,updated_at",
      [template, headline, bodyText, ctaText, id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Campaign not found." });
    return res.status(200).json({ content: result.rows[0] });
  } catch {
    return res.status(503).json({ error: "Email content service unavailable." });
  } finally {
    client?.release();
  }
};
