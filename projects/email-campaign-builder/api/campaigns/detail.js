"use strict";
const { parseCookies, hashToken, getClient } = require("../../lib/auth");
module.exports = async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({error:"Method not allowed"});}
 const id=typeof req.query?.id==="string"?req.query.id:"";
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:"Invalid campaign id."});
 const token=parseCookies(req.headers.cookie)["__Host-ecb_session"];if(!token)return res.status(401).json({error:"Authentication required."});
 let client;try{client=await getClient();const session=await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1",[hashToken(token)]);const userId=session.rows[0]?.user_id;if(!userId)return res.status(401).json({error:"Authentication required."});
 const result=await client.query("SELECT c.id,c.name,c.subject_line,c.audience,c.status,c.template,c.headline,c.body_text,c.cta_text,a.id AS audience_segment_id,a.name AS audience_name,a.source AS audience_source,a.condition AS audience_condition,c.created_at,c.updated_at FROM campaigns c LEFT JOIN audience_segments a ON a.id=c.audience_segment_id AND a.user_id=c.user_id WHERE c.id=$1 AND c.user_id=$2 LIMIT 1",[id,userId]);
 if(!result.rows[0])return res.status(404).json({error:"Campaign not found."});res.setHeader("Cache-Control","no-store");return res.status(200).json({campaign:result.rows[0]});
 }catch{return res.status(503).json({error:"Campaign detail service unavailable."});}finally{client?.release();}
};
