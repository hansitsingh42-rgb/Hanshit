const crypto = require("node:crypto");
const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");
const { isUuid } = require("../../lib/input-validation");

module.exports=async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 if(!validCsrf(req))return res.status(403).json({error:"Request validation failed."});
 const campaignId=typeof req.query?.campaignId==="string"?req.query.campaignId.trim():"";
 if(!isUuid(campaignId))return res.status(400).json({error:"Campaign id is invalid."});
 const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];if(!token)return res.status(401).json({error:"Authentication required."});
 let client;
 try{
  client=await getClient();
  const session=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);
  const userId=session.rows[0]?.user_id;if(!userId)return res.status(401).json({error:"Authentication required."});
  await client.query("BEGIN");
  const campaign=await client.query("SELECT id,status,scheduled_at,audience_segment_id,subject_line,headline,body_text FROM campaigns WHERE id=$1 AND user_id=$2 FOR UPDATE",[campaignId,userId]);
  const c=campaign.rows[0];
  if(!c){await client.query("ROLLBACK");return res.status(404).json({error:"Campaign not found."});}
  if(c.status!=="scheduled"||!c.scheduled_at||new Date(c.scheduled_at).getTime()>Date.now()){await client.query("ROLLBACK");return res.status(409).json({error:"Campaign is not due for delivery."});}
  if(!c.audience_segment_id||!c.subject_line||!c.headline||!c.body_text){await client.query("ROLLBACK");return res.status(409).json({error:"Campaign is not ready for delivery."});}
  const contacts=await client.query("SELECT DISTINCT c.id FROM audience_contacts c JOIN audience_segment_contacts sc ON sc.contact_id=c.id JOIN audience_segments s ON s.id=sc.segment_id WHERE s.id=$1 AND s.user_id=$2 AND c.user_id=$2 AND c.status='subscribed' ORDER BY c.id",[c.audience_segment_id,userId]);
  let queued=0;
  for(const row of contacts.rows){
   const result=await client.query("INSERT INTO delivery_jobs(id,campaign_id,contact_id,status,available_at) VALUES($1,$2,$3,'queued',NOW()) ON CONFLICT(campaign_id,contact_id) DO NOTHING",[crypto.randomUUID(),campaignId,row.id]);
   if(result.rowCount===1)queued++;
  }
  const counts=await client.query("SELECT COUNT(*) FILTER (WHERE status='queued')::int AS queued, COUNT(*) FILTER (WHERE status='sent')::int AS sent, COUNT(*) FILTER (WHERE status='failed')::int AS failed FROM delivery_jobs WHERE campaign_id=$1",[campaignId]);
  await client.query("COMMIT");
  return res.status(200).json({campaignId,prepared:queued,queue:counts.rows[0],delivery:"queued_only",message:"Delivery jobs prepared. No email was sent by this endpoint."});
 }catch{try{await client?.query("ROLLBACK");}catch{}return res.status(503).json({error:"Delivery preparation service unavailable."});}
 finally{client?.release();}
};