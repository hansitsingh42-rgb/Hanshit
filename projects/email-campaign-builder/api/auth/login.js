"use strict";

const crypto = require("node:crypto");
const { sameOriginRequest,
  normalizeEmail, validEmail, hashToken, verifyPassword, randomToken,
  sessionCookie, getClient, SESSION_DAYS
} = require("../../lib/auth");

function genericFailure(res) {
  return res.status(401).json({ error: "Invalid email or password." });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!sameOriginRequest(req)) return res.status(403).json({ error: "Request origin rejected." });

  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!validEmail(email) || password.length < 8 || Buffer.byteLength(password, "utf8") > 512) {
    return genericFailure(res);
  }

  let client;
  try {
    client = await getClient();
    const keyHash = hashToken(email + "|" + (req.headers["x-forwarded-for"] || "unknown"));
    const attempt = await client.query("SELECT attempts, window_started_at, blocked_until FROM login_attempts WHERE key_hash=$1", [keyHash]);
    const row = attempt.rows[0];
    const now = Date.now();
    if (row?.blocked_until && new Date(row.blocked_until).getTime() > now) return genericFailure(res);

    const userResult = await client.query("SELECT id, password_hash FROM users WHERE email=$1 LIMIT 1", [email]);
    if (!userResult.rows[0] || !verifyPassword(password, userResult.rows[0].password_hash)) {
      const attempts = row && now - new Date(row.window_started_at).getTime() < 15 * 60 * 1000 ? row.attempts + 1 : 1;
      const blocked = attempts >= 8 ? new Date(now + 15 * 60 * 1000) : null;
      await client.query(
        "INSERT INTO login_attempts(key_hash,attempts,window_started_at,blocked_until) VALUES($1,$2,NOW(),$3) ON CONFLICT(key_hash) DO UPDATE SET attempts=$2,window_started_at=CASE WHEN $2=1 THEN NOW() ELSE login_attempts.window_started_at END,blocked_until=$3",
        [keyHash, attempts, blocked]
      );
      return genericFailure(res);
    }

    const token = randomToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(now + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await client.query("DELETE FROM sessions WHERE user_id=$1 OR expires_at < NOW()", [userResult.rows[0].id]);
    await client.query("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES($1,$2,$3,$4)", [crypto.randomUUID(), userResult.rows[0].id, tokenHash, expiresAt]);

    await client.query("DELETE FROM login_attempts WHERE key_hash=$1", [keyHash]);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Set-Cookie", sessionCookie(token, SESSION_DAYS * 24 * 60 * 60));
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(503).json({ error: "Authentication service unavailable." });
  } finally {
    client?.release();
  }
};
