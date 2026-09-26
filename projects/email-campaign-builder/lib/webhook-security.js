"use strict";

const crypto = require("node:crypto");

function canonicalize(value){
 if(value===null||typeof value!=="object") return JSON.stringify(value);
 if(Array.isArray(value)) return "["+value.map(canonicalize).join(",")+"]";
 return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+canonicalize(value[k])).join(",")+"}";
}

function verifyWebhook(payload, signature, secret){
 if(!signature||!secret) return false;
 const expected=crypto.createHmac("sha256",secret).update(canonicalize(payload),"utf8").digest("hex");
 const supplied=String(signature).replace(/^sha256=/i,"").trim();
 if(!/^[a-f0-9]{64}$/i.test(supplied)) return false;
 return crypto.timingSafeEqual(Buffer.from(expected,"hex"),Buffer.from(supplied,"hex"));
}

module.exports={canonicalize,verifyWebhook};
