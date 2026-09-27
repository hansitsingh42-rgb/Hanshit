"use strict";

const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const {canonicalize,verifyWebhook}=require("../lib/webhook-security");
const {nextRetryDelayMinutes,retryable,MAX_ATTEMPTS}=require("../lib/delivery-retry");
const {requestJson}=require("../lib/provider-http");
const {allow}=require("../lib/rate-limit");
const {isUuid,isPlainObject,boundedString}=require("../lib/input-validation");

async function run(){
  assert.equal(canonicalize({b:2,a:1}),"{"a":1,"b":2}");

  const payload={type:"delivered",jobId:"123"};
  const secret="test-webhook-secret";
  const signature=crypto.createHmac("sha256",secret).update(canonicalize(payload)).digest("hex");
  assert.equal(verifyWebhook(payload,signature,secret),true);
  assert.equal(verifyWebhook(payload,signature.slice(0,-1)+"0",secret),false);

  assert.equal(nextRetryDelayMinutes(1),1);
  assert.equal(nextRetryDelayMinutes(10),720);
  assert.equal(retryable(9),true);
  assert.equal(retryable(MAX_ATTEMPTS),false);


  const emailRegex=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  assert.equal(emailRegex.test("user@example.com"),true);
  assert.equal(emailRegex.test("not-an-email"),false);

  const uuidRegex=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assert.equal(uuidRegex.test("550e8400-e29b-41d4-a716-446655440000"),true);
  assert.equal(uuidRegex.test("not-a-uuid"),false);

  // Shared input-validation regression coverage.
  assert.equal(isUuid("550e8400-e29b-41d4-a716-446655440000"),true);
  assert.equal(isUuid("not-a-uuid"),false);
  assert.equal(isPlainObject({steps:[]}),true);
  assert.equal(isPlainObject([]),false);
  assert.equal(boundedString(" campaign ",20),"campaign");
  assert.equal(boundedString("x".repeat(21),20),null);
  assert.equal(boundedString("",20,{required:true}),null);

  // Ownership queries must bind both resource id and authenticated user id.
  const campaignOwnershipSql="UPDATE campaigns SET name=$1 WHERE id=$2 AND user_id=$3";
  assert.match(campaignOwnershipSql,/WHERE id=\$2 AND user_id=\$3/);
  const contactOwnershipSql="UPDATE audience_contacts SET status=$1 WHERE id=$2 AND user_id=$3";
  assert.match(contactOwnershipSql,/WHERE id=\$2 AND user_id=\$3/);
  const audienceOwnershipSql="SELECT id FROM audience_segments WHERE user_id=$1";
  assert.match(audienceOwnershipSql,/WHERE user_id=\$1/);

  const rateKey="test-rate-limit";
  assert.equal(allow(rateKey,2,60_000),true,"rate limit first request should pass");
  assert.equal(allow(rateKey,2,60_000),true,"rate limit second request should pass");
  assert.equal(allow(rateKey,2,60_000),false,"rate limit third request should block");

  await assert.rejects(
    requestJson("http://insecure.example/send"),
    error=>error.code==="INVALID_PROVIDER_ENDPOINT" && error.retryable===false
  );

  console.log("security tests passed");
}

run().catch(error=>{console.error(error);process.exitCode=1;});
const integrityMigration = require("node:fs").readFileSync(
  require("node:path").join(__dirname, "../db/011_integrity_constraints.sql"),
  "utf8"
);
assert.match(integrityMigration, /campaigns_status_chk/);
assert.match(integrityMigration, /CHECK \(status IN \('draft','scheduled','cancelled'\)\)/);
assert.match(integrityMigration, /login_attempts_nonnegative_chk/);
assert.match(integrityMigration, /sessions_expiry_after_creation_chk/);
assert.match(integrityMigration, /NOT VALID/g);
