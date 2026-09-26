"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const BATCH_SIZE=25;

module.exports=async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];
 if(!token)return res.status(401).json({error:"Authentication required."});
 let client;
 try{
  client=await getClient();
  const session=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);
  const userId=session.rows[0]?.user_id;if(!userId)return res.status(401).json({error:"Authentication required."});
  await client.query("BEGIN");
  const result=await client.query(
   "WITH picked AS (SELECT d.id FROM delivery_jobs d JOIN campaigns c ON c.id=d.campaign_id WHERE c.user_id=$1 AND d.status='queued' AND d.available_at<=NOW() AND d.attempts<10 ORDER BY d.available_at,d.id FOR UPDATE SKIP LOCKED LIMIT $2) UPDATE delivery_jobs d SET status='processing',attempts=d.attempts+1,processing_started_at=NOW(),updated_at=NOW() FROM picked WHERE d.id=picked.id RETURNING d.id",
   [userId,BATCH_SIZE]
  );
  await client.query("COMMIT");
  return res.status(200).json({claimed:result.rowCount,mode:"worker-foundation",message:"Jobs claimed for provider processing. No email was sent."});
 }catch{try{await client?.query("ROLLBACK");}catch{}return res.status(503).json({error:"Delivery worker service unavailable."});}
 finally{client?.release();}
};