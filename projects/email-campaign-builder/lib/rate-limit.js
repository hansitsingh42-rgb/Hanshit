"use strict";

const crypto=require("node:crypto");

const buckets=new Map();
const MAX_BUCKETS=5000;
// This limiter is intentionally process-local. Production multi-instance/serverless deployments
// must replace it with a shared atomic store (for example Redis) before relying on it for abuse control.

function keyHash(value){
  return crypto.createHash("sha256").update(String(value||"")).digest("hex");
}

function allow(key,limit,windowMs){
  const now=Date.now();
  const hashed=keyHash(key);
  const current=buckets.get(hashed);
  if(!current || current.resetAt<=now){
    if(buckets.size>=MAX_BUCKETS){
      for(const [bucketKey,bucket] of buckets){
        if(bucket.resetAt<=now)buckets.delete(bucketKey);
        if(buckets.size<MAX_BUCKETS)break;
      }
      if(buckets.size>=MAX_BUCKETS)return false;
    }
    buckets.set(hashed,{count:1,resetAt:now+windowMs});
    return true;
  }
  if(current.count>=limit)return false;
  current.count+=1;
  return true;
}

function clientKey(req,prefix){
  const trustProxy=process.env.TRUST_PROXY==="true";
  const forwarded=trustProxy ? String(req.headers["x-forwarded-for"]||"").split(",")[0].trim() : "";
  const ip=forwarded || String(req.socket?.remoteAddress||"unknown");
  return prefix+":"+ip;
}

module.exports={allow,clientKey};
