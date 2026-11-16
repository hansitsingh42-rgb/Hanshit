"use strict";

const { parseCookies, hashToken, clearSessionCookie, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  let client;
  try {
    if (token) {
      client = await getClient();
      await client.query("DELETE FROM sessions WHERE token_hash=$1", [hashToken(token)]);
    }
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(503).json({ error: "Authentication service unavailable." });
  } finally {
    client?.release();
  }
};
