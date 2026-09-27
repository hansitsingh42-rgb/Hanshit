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

  await assert.rejects(
    requestJson("http://insecure.example/send"),
    error=>error.code==="INVALID_PROVIDER_ENDPOINT" && error.retryable===false
  );

  console.log("security tests passed");
}

run().catch(error=>{console.error(error);process.exitCode=1;});
