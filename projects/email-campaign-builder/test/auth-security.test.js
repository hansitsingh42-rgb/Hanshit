"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const {
  normalizeEmail,
  validEmail,
  hashToken,
  hashPassword,
  verifyPassword,
  parseCookies,
  sessionCookie,
  clearSessionCookie,
  sameOriginRequest
} = require("../lib/auth");
const { validCsrf } = require("../lib/request-security");

function mockReq(overrides = {}) {
  return {
    headers: {},
    ...overrides
  };
}

function run() {
  assert.equal(normalizeEmail("  USER@Example.COM "), "user@example.com");
  assert.equal(validEmail("user@example.com"), true);
  assert.equal(validEmail("not-an-email"), false);
  assert.equal(validEmail("a@b"), false);

  const password = "secure-test-password";
  const stored = hashPassword(password);
  assert.equal(stored.startsWith("scrypt$16384$8$1$"), true);
  assert.equal(verifyPassword(password, stored), true);
  assert.equal(verifyPassword("wrong-password", stored), false);
  assert.equal(verifyPassword("x".repeat(513), stored), false);

  const token = crypto.randomBytes(32).toString("base64url");
  const hashed = hashToken(token);
  assert.equal(hashed.length, 64);
  assert.notEqual(hashed, token);

  const parsed = parseCookies("__Host-ecb_session=abc123; theme=dark");
  assert.equal(parsed["__Host-ecb_session"], "abc123");
  assert.equal(parsed.theme, "dark");

  const malformed = parseCookies("__Host-ecb_session=%E0%A4%A; safe=value");
  assert.equal(malformed.safe, "value");
  assert.equal(Object.hasOwn(malformed, "__Host-ecb_session"), false);

  const devCookie = sessionCookie("token", 604800);
  assert.match(devCookie, /^__Host-ecb_session=/);
  assert.match(devCookie, /Path=\//);
  assert.match(devCookie, /HttpOnly/);
  assert.match(devCookie, /SameSite=Lax/);
  assert.match(devCookie, /Max-Age=604800/);
  assert.doesNotMatch(devCookie, /; Secure/);

  const clearCookie = clearSessionCookie();
  assert.match(clearCookie, /HttpOnly/);
  assert.match(clearCookie, /SameSite=Lax/);
  assert.match(clearCookie, /Max-Age=0/);

  assert.equal(sameOriginRequest(mockReq({headers:{origin:"https://example.com",host:"example.com"}})), true);
  assert.equal(sameOriginRequest(mockReq({headers:{origin:"https://evil.example",host:"example.com"}})), false);
  assert.equal(sameOriginRequest(mockReq({headers:{origin:"not-a-url",host:"example.com"}})), false);
  assert.equal(sameOriginRequest(mockReq({headers:{host:"example.com"}})), true);

  const csrfToken = "csrf-test-token";
  const csrfReq = mockReq({
    headers: {
      origin: "https://example.com",
      host: "example.com",
      cookie: "__Host-ecb_csrf=" + encodeURIComponent(csrfToken),
      "x-csrf-token": csrfToken
    }
  });
  assert.equal(validCsrf(csrfReq), true);
  assert.equal(validCsrf({...csrfReq, headers:{...csrfReq.headers, "x-csrf-token":"wrong"}}), false);
  assert.equal(validCsrf({...csrfReq, headers:{...csrfReq.headers, origin:"https://evil.example"}}), false);

  console.log("auth security tests passed");
}

run();
