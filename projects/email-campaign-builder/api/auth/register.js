"use strict";

const { sameOriginRequest, normalizeEmail, validEmail, hashPassword, getClient } = require("../../lib/auth");
const { clientKey, allow } = require("../../lib/rate-limit");

function genericFailure(res) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(400).json({ error: "Unable to create the account. Check your details and try again." });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!sameOriginRequest(req)) return res.status(403).json({ error: "Request origin rejected." });
  if (!allow(clientKey(req, "auth-register"), 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Too many registration attempts. Try again later." });
  }

  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!validEmail(email) || password.length < 8 || password.length > 128 || Buffer.byteLength(password, "utf8") > 512) {
    return genericFailure(res);
  }

  let client;
  try {
    client = await getClient();
    const passwordHash = hashPassword(password);
    const result = await client.query(
      "INSERT INTO users(id,email,password_hash) VALUES($1,$2,$3) ON CONFLICT(email) DO NOTHING RETURNING id",
      [require("node:crypto").randomUUID(), email, passwordHash]
    );
    if (!result.rows[0]) return genericFailure(res);
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(503).json({ error: "Authentication service unavailable." });
  } finally {
    client?.release();
  }
};
