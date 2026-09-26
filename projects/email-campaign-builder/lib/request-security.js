"use strict";

const crypto = require("node:crypto");
const { parseCookies, randomToken, sameOriginRequest } = require("./auth");

function csrfCookie(token, maxAge = 7200) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `__Host-ecb_csrf=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function issueCsrf(res) {
  const token = randomToken(32);
  res.setHeader("Set-Cookie", csrfCookie(token));
  return token;
}

function validCsrf(req) {
  if (!sameOriginRequest(req)) return false;
  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies["__Host-ecb_csrf"];
  const headerToken = req.headers["x-csrf-token"];
  if (!cookieToken || typeof headerToken !== "string") return false;
  const a = Buffer.from(cookieToken);
  const b = Buffer.from(headerToken);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { issueCsrf, validCsrf };
