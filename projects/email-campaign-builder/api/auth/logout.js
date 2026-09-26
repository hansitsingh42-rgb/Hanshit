"use strict";

const { sameOriginRequest, parseCookies, hashToken, clearSessionCookie, getClient } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!sameOriginRequest(req)) return res.status(403).json({ error: "Request origin rejected." });

  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  let client;
  try {
    if (token) {
      client = await getClient();
      await client.query("DELETE FROM sessions WHERE token_hash=$1", [hashToken(token)]);
    }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(503).json({ error: "Authentication service unavailable." });
  } finally {
    client?.release();
  }
};
