"use strict";

const { getClient } = require("../../lib/auth");
const { verifyWebhook } = require("../../lib/webhook-security");

const eventIdPattern=/^[A-Za-z0-9._:-]{1,200}$/;

module.exports=async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 const secret=process.env.EMAIL_PROVIDER_WEBHOOK_SECRET;
 const eventId=String(req.headers["x-provider-event-id"]||"").trim();
 if(!secret||!eventId||!eventIdPattern.test(eventId))return res.status(401).json({error:"Webhook authentication failed."});
 const payload=req.body;
 if(!payload||typeof payload!=="object"||Array.isArray(payload))return res.status(400).json({error:"Webhook payload is invalid."});
 if(!verifyWebhook(payload,req.headers["x-provider-signature"],secret))return res.status(401).json({error:"Webhook authentication failed."});
 const type=typeof payload.type==="string"?payload.type.trim():"";
 const jobId=typeof payload.jobId==="string"?payload.jobId.trim():"";
 if(!jobId||!["delivered","failed","bounced","unsubscribed"].includes(type))return res.status(400).json({error:"Webhook event is invalid."});
 let client;
 try{
  client=await getClient();
  await client.query("BEGIN");
  const inserted=await client.query("INSERT INTO provider_webhook_events(event_id) VALUES($1) ON CONFLICT(event_id) DO NOTHING",[eventId]);
  if(inserted.rowCount===0){await client.query("ROLLBACK");return res.status(200).json({accepted:true,replayed:true});}
  let result;
  if(type==="delivered"){
   result=await client.query("UPDATE delivery_jobs SET status='sent',processing_started_at=NULL,last_error_code=NULL,updated_at=NOW() WHERE id=$1 AND status IN ('processing','queued') RETURNING id",[jobId]);
  }else if(type==="failed"){
   result=await client.query("UPDATE delivery_jobs SET status=CASE WHEN attempts>=10 THEN 'failed' ELSE 'queued' END,available_at=CASE WHEN attempts>=10 THEN available_at ELSE NOW()+INTERVAL '5 minutes' END,processing_started_at=NULL,last_error_code='PROVIDER_DELIVERY_FAILED',updated_at=NOW() WHERE id=$1 AND status='processing' RETURNING id",[jobId]);
  }else{
   result=await client.query("UPDATE delivery_jobs SET status='failed',processing_started_at=NULL,last_error_code=$2,updated_at=NOW() WHERE id=$1 AND status='processing' RETURNING contact_id",[jobId,type==="bounced"?"RECIPIENT_BOUNCED":"RECIPIENT_UNSUBSCRIBED"]);
   if(result.rowCount===1){
    const contactId=result.rows[0].contact_id;
    await client.query("UPDATE audience_contacts SET status=$2,updated_at=NOW() WHERE id=$1",[contactId,type==="bounced"?"suppressed":"unsubscribed"]);
   }
  }
  if(result.rowCount!==1){await client.query("ROLLBACK");return res.status(404).json({error:"Delivery job not found."});}
  await client.query("COMMIT");
  return res.status(200).json({accepted:true});
 }catch{try{await client?.query("ROLLBACK");}catch{}return res.status(503).json({error:"Webhook service unavailable."});}
 finally{client?.release();}
};
