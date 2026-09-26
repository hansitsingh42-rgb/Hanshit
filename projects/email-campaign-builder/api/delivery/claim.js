"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");

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
   "UPDATE delivery_jobs d SET status='processing',attempts=d.attempts+1,processing_started_at=NOW(),updated_at=NOW() FROM campaigns c WHERE d.campaign_id=c.id AND c.user_id=$1 AND d.status='queued' AND d.available_at<=NOW() AND d.attempts<10 RETURNING d.id",
   [userId]
  );
  await client.query("COMMIT");
  return res.status(200).json({claimed:result.rowCount,mode:"worker-foundation",message:"Jobs claimed for provider processing. No email was sent."});
 }catch{try{await client?.query("ROLLBACK");}catch{}return res.status(503).json({error:"Delivery worker service unavailable."});}
 finally{client?.release();}
};