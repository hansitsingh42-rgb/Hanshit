"use strict";
const { parseCookies,hashToken,getClient }=require("../../lib/auth");
const { isUuid } = require("../../lib/input-validation");
module.exports=async function(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({error:"Method not allowed"});}
 const campaignId=typeof req.query?.campaignId==="string"?req.query.campaignId:"";
 if(!isUuid(campaignId))return res.status(400).json({error:"Invalid campaign id."});
 const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];if(!token)return res.status(401).json({error:"Authentication required."});
 let client;try{client=await getClient();const s=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);const uid=s.rows[0]?.user_id;if(!uid)return res.status(401).json({error:"Authentication required."});
 const w=await client.query("SELECT id,name,status,created_at,updated_at FROM automation_workflows WHERE campaign_id=$1 AND user_id=$2 ORDER BY updated_at DESC LIMIT 1",[campaignId,uid]);if(!w.rows[0])return res.status(200).json({workflow:null});
 const steps=await client.query("SELECT id,step_order,trigger_type,delay_type,action_type FROM automation_steps WHERE workflow_id=$1 ORDER BY step_order",[w.rows[0].id]);return res.status(200).json({workflow:{...w.rows[0],steps:steps.rows}});
 }catch{return res.status(503).json({error:"Automation service unavailable."});}finally{client?.release();}
};
