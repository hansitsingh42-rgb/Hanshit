"use strict";

const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const {canonicalize,verifyWebhook}=require("../lib/webhook-security");
const {nextRetryDelayMinutes,retryable,MAX_ATTEMPTS}=require("../lib/delivery-retry");
const {requestJson}=require("../lib/provider-http");

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

  await assert.rejects(
    requestJson("http://insecure.example/send"),
    error=>error.code==="INVALID_PROVIDER_ENDPOINT" && error.retryable===false
  );

  console.log("security tests passed");
}

run().catch(error=>{console.error(error);process.exitCode=1;});
