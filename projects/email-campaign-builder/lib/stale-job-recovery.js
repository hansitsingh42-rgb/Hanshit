"use strict";

const { getClient } = require("./auth");
const STALE_MINUTES=15;

async function recoverStaleJobs(limit=25){
 const client=await getClient();
 try{
  const result=await client.query(
   "WITH stale AS (SELECT id,attempts FROM delivery_jobs WHERE status='processing' AND processing_started_at<=NOW()-($1 * INTERVAL '1 minute') ORDER BY processing_started_at,id FOR UPDATE SKIP LOCKED LIMIT $2) UPDATE delivery_jobs d SET status=CASE WHEN stale.attempts<10 THEN 'queued' ELSE 'failed' END,available_at=CASE WHEN stale.attempts<10 THEN NOW()+(CASE WHEN stale.attempts<=1 THEN 1 WHEN stale.attempts=2 THEN 5 WHEN stale.attempts=3 THEN 15 WHEN stale.attempts=4 THEN 30 WHEN stale.attempts=5 THEN 60 WHEN stale.attempts=6 THEN 120 WHEN stale.attempts=7 THEN 240 WHEN stale.attempts=8 THEN 480 ELSE 720 END * INTERVAL '1 minute') ELSE d.available_at END,processing_started_at=NULL,last_error_code=CASE WHEN stale.attempts<10 THEN 'WORKER_TIMEOUT' ELSE 'MAX_ATTEMPTS_EXCEEDED' END,updated_at=NOW() FROM stale WHERE d.id=stale.id RETURNING d.id,d.status",
   [STALE_MINUTES,Math.min(Math.max(Number(limit)||25,1),25)]
  );
  return {recovered:result.rowCount};
 }finally{client.release();}
}

module.exports={recoverStaleJobs,STALE_MINUTES};
