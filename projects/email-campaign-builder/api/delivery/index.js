"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports=async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({error:"Method not allowed"});}
 const campaignId=typeof req.query?.campaignId==="string"?req.query.campaignId.trim():"";
 if(!uuid.test(campaignId))return res.status(400).json({error:"Campaign id is invalid."});
 const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];if(!token)return res.status(401).json({error:"Authentication required."});
 let client;
 try{
  client=await getClient();
  const session=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);
  const userId=session.rows[0]?.user_id;if(!userId)return res.status(401).json({error:"Authentication required."});
  const result=await client.query("SELECT d.status,COUNT(*)::int AS count FROM delivery_jobs d JOIN campaigns c ON c.id=d.campaign_id WHERE d.campaign_id=$1 AND c.user_id=$2 GROUP BY d.status ORDER BY d.status",[campaignId,userId]);
  res.setHeader("Cache-Control","no-store");return res.status(200).json({campaignId,delivery:result.rows});
 }catch{return res.status(503).json({error:"Delivery service unavailable."});}
 finally{client?.release();}
};