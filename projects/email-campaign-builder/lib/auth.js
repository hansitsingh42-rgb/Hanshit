"use strict";

const crypto = require("node:crypto");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined
});

const SESSION_DAYS = 7;
const PASSWORD_MAX_BYTES = 512;

function fail(message) {
  const error = new Error(message);
  error.publicCode = "AUTH_CONFIGURATION_ERROR";
  return error;
}

function requireDatabase() {
  if (!process.env.DATABASE_URL) throw fail("Authentication is not configured.");
}

function normalizeEmail(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function validEmail(email) {
  return email.length >= 3 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024
  });
  return "scrypt$16384$8$1$" + salt.toString("base64url") + "$" + derived.toString("base64url");
}

function verifyPassword(password, stored) {
  const parts = String(stored).split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltText, hashText] = parts;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(hashText, "base64url");
  if (!salt.length || !expected.length || Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) return false;
  const actual = crypto.scryptSync(password, salt, expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024
  });
  return crypto.timingSafeEqual(actual, expected);
}

function parseCookies(header) {
  const result = {};
  for (const part of String(header || "").split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    result[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return result;
}

function sessionCookie(token, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `__Host-ecb_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `__Host-ecb_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

async function getClient() {
  requireDatabase();
  return pool.connect();
}

module.exports = {
  pool, normalizeEmail, validEmail, hashToken, hashPassword, verifyPassword,
  randomToken, parseCookies, sessionCookie, clearSessionCookie, getClient, SESSION_DAYS
};
