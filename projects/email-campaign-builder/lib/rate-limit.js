"use strict";

const crypto=require("node:crypto");

const buckets=new Map();

function keyHash(value){
  return crypto.createHash("sha256").update(String(value||"")).digest("hex");
}

function allow(key,limit,windowMs){
  const now=Date.now();
  const hashed=keyHash(key);
  const current=buckets.get(hashed);
  if(!current || current.resetAt<=now){
    buckets.set(hashed,{count:1,resetAt:now+windowMs});
    return true;
  }
  if(current.count>=limit)return false;
  current.count+=1;
  return true;
}

function clientKey(req,prefix){
  const forwarded=String(req.headers["x-forwarded-for"]||"").split(",")[0].trim();
  const ip=forwarded || String(req.socket?.remoteAddress||"unknown");
  return prefix+":"+ip;
}

module.exports={allow,clientKey};
