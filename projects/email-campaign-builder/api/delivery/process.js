"use strict";

const crypto=require("node:crypto");
const { getClient }=require("../../lib/auth");
const { processClaimedJob }=require("../../lib/delivery-worker");
const { requeueFailedJob, failJob }=require("../../lib/delivery-recovery");

const LIMIT=5;

function authorized(req){
  const secret=process.env.CRON_SECRET;
  const header=String(req.headers.authorization||"");
  if(typeof secret!=="string" || secret.length<24 || !header.startsWith("Bearer ")) return false;
  const supplied=header.slice(7);
  const a=Buffer.from(supplied);
  const b=Buffer.from(secret);
  return a.length===b.length && crypto.timingSafeEqual(a,b);
}

async function claimJobs(){
  const client=await getClient();
  try{
    await client.query("BEGIN");
    const result=await client.query(
      "WITH picked AS (SELECT id FROM delivery_jobs WHERE status='queued' AND available_at<=NOW() AND attempts<10 ORDER BY available_at,id FOR UPDATE SKIP LOCKED LIMIT $1) UPDATE delivery_jobs d SET status='processing',attempts=d.attempts+1,processing_started_at=NOW(),updated_at=NOW() FROM picked WHERE d.id=picked.id RETURNING d.id",
      [LIMIT]
    );
    await client.query("COMMIT");
    return result.rows.map(row=>row.id);
  }catch(error){
    try{await client.query("ROLLBACK");}catch{}
    throw error;
  }finally{client.release();}
}

module.exports=async function handler(req,res){
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
  if(!authorized(req)) return res.status(401).json({error:"Unauthorized."});
  if(!process.env.DATABASE_URL) return res.status(503).json({error:"Delivery worker unavailable."});

  try{
    const jobs=await claimJobs();
    const results=[];
    for(const id of jobs){
      try{
        results.push(await processClaimedJob(id));
      }catch(error){
        const code=typeof error?.code==="string" && /^[A-Z0-9_]{1,80}$/.test(error.code) ? error.code : "DELIVERY_WORKER_ERROR";
        if(error?.retryable){
          const db=await getClient();
          try{
            const attempt=await db.query("SELECT attempts FROM delivery_jobs WHERE id=$1 LIMIT 1",[id]);
            const attempts=Number(attempt.rows[0]?.attempts||1);
            results.push(await requeueFailedJob(id,attempts,code));
          }finally{db.release();}
        }else results.push(await failJob(id,code));
      }
    }
    return res.status(200).json({processed:results.length,results});
  }catch{
    return res.status(503).json({error:"Delivery worker service unavailable."});
  }
};
