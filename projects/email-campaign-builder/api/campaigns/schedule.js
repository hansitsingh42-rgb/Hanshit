"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");
const { isUuid, isPlainObject, boundedString } = require("../../lib/input-validation");
const { allow, clientKey } = require("../../lib/rate-limit");

module.exports = async function handler(req,res){
  if(req.method!=="PATCH"){res.setHeader("Allow","PATCH");return res.status(405).json({error:"Method not allowed"});}
  if(!validCsrf(req))return res.status(403).json({error:"Request validation failed."});
  if(!allow(clientKey(req, "campaign-schedule"), 30, 60 * 60 * 1000))return res.status(429).json({error:"Too many scheduling requests."});
  const id=typeof req.query?.id==="string"?req.query.id:"";
  if(!isUuid(id))return res.status(400).json({error:"Invalid campaign id."});
  const data=isPlainObject(req.body)?req.body:{};
  const status=boundedString(data.status,20)||"";
  const allowed=new Set(["draft","scheduled","cancelled"]);
  if(!allowed.has(status))return res.status(400).json({error:"Invalid campaign status."});
  let scheduledAt=null;
  if(status==="scheduled"){
    if(typeof data.scheduledAt!=="string"||data.scheduledAt.trim().length>64||!data.scheduledAt.trim())return res.status(400).json({error:"A schedule time is required."});
    const parsed=new Date(data.scheduledAt);
    if(Number.isNaN(parsed.getTime())||parsed.getTime()<=Date.now())return res.status(400).json({error:"Schedule time must be in the future."});
    if(parsed.getTime()>Date.now()+90*24*60*60*1000)return res.status(400).json({error:"Schedule time is too far in the future."});
    scheduledAt=parsed.toISOString();
  }
  const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if(!token)return res.status(401).json({error:"Authentication required."});
  let client;
  try{
    client=await getClient();
    const session=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);
    const userId=session.rows[0]?.user_id;if(!userId)return res.status(401).json({error:"Authentication required."});
    const result=await client.query("UPDATE campaigns SET status=$1,scheduled_at=$2,updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING id,status,scheduled_at,updated_at",[status,scheduledAt,id,userId]);
    if(!result.rows[0])return res.status(404).json({error:"Campaign not found."});
    return res.status(200).json({campaign:result.rows[0]});
  }catch{return res.status(503).json({error:"Campaign scheduling service unavailable."});}
  finally{client?.release();}
};
