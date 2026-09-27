"use strict";
const crypto=require("node:crypto");
const {parseCookies,hashToken,getClient}=require("../../lib/auth");
const {validCsrf}=require("../../lib/request-security");
const {isUuid,isPlainObject}=require("../../lib/input-validation");
const uuid=()=>crypto.randomUUID();
module.exports=async function(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
 if(!validCsrf(req))return res.status(403).json({error:"Request validation failed."});
 const campaignId=typeof req.query?.campaignId==="string"?req.query.campaignId:"";
 if(!isUuid(campaignId))return res.status(400).json({error:"Invalid campaign id."});
 const data=isPlainObject(req.body)?req.body:{};const raw=Array.isArray(data.steps)?data.steps:[];
 if(raw.length<1||raw.length>100)return res.status(400).json({error:"Workflow steps are invalid."});
 const allowedTriggers=new Set(["New subscriber","Audience segment added","Campaign engagement"]);
 const allowedDelays=new Set(["Immediately","1 day","3 days","7 days"]);
 const allowedActions=new Set(["Send campaign email","Wait for engagement","Move to another segment"]);
 const steps=raw.map((s,i)=>({order:i+1,trigger:typeof s==="object"&&s!==null&&!Array.isArray(s)&&typeof s.trigger==="string"?s.trigger.trim():"",delay:typeof s==="object"&&s!==null&&!Array.isArray(s)&&typeof s.delay==="string"?s.delay.trim():"",action:typeof s==="object"&&s!==null&&!Array.isArray(s)&&typeof s.action==="string"?s.action.trim():""}));
 if(steps.some(s=>!allowedTriggers.has(s.trigger)||!allowedDelays.has(s.delay)||!allowedActions.has(s.action)))return res.status(400).json({error:"Workflow steps are invalid."});
 const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];if(!token)return res.status(401).json({error:"Authentication required."});
 let client;try{client=await getClient();const s=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);const uid=s.rows[0]?.user_id;if(!uid)return res.status(401).json({error:"Authentication required."});
 const owner=await client.query("SELECT id FROM campaigns WHERE id=$1 AND user_id=$2",[campaignId,uid]);if(!owner.rows[0])return res.status(404).json({error:"Campaign not found."});
 await client.query("BEGIN");const existing=await client.query("SELECT id FROM automation_workflows WHERE campaign_id=$1 AND user_id=$2 LIMIT 1",[campaignId,uid]);let wid=existing.rows[0]?.id;if(!wid){wid=uuid();await client.query("INSERT INTO automation_workflows(id,user_id,campaign_id) VALUES($1,$2,$3)",[wid,uid,campaignId]);}else{await client.query("DELETE FROM automation_steps WHERE workflow_id=$1",[wid]);await client.query("UPDATE automation_workflows SET updated_at=NOW() WHERE id=$1",[wid]);}
 for(const s2 of steps)await client.query("INSERT INTO automation_steps(id,workflow_id,step_order,trigger_type,delay_type,action_type) VALUES($1,$2,$3,$4,$5,$6)",[uuid(),wid,s2.order,s2.trigger,s2.delay,s2.action]);
 await client.query("COMMIT");return res.status(200).json({saved:true});
 }catch{try{await client?.query("ROLLBACK");}catch{}return res.status(503).json({error:"Automation service unavailable."});}finally{client?.release();}
};
