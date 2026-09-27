"use strict";

const { getClient } = require("./auth");
const { nextRetryDelayMinutes, retryable } = require("./delivery-retry");

async function requeueFailedJob(jobId, attempts, errorCode){
 const client=await getClient();
 try{
  if(retryable(attempts)){
   const delay=nextRetryDelayMinutes(attempts);
   await client.query("UPDATE delivery_jobs SET status='queued',available_at=NOW()+($2 * INTERVAL '1 minute'),processing_started_at=NULL,last_error_code=$3,updated_at=NOW() WHERE id=$1 AND status='processing'",[jobId,delay,errorCode]);
   return {status:"queued",retryInMinutes:delay};
  }
  await client.query("UPDATE delivery_jobs SET status='failed',processing_started_at=NULL,last_error_code=$2,updated_at=NOW() WHERE id=$1 AND status='processing'",[jobId,errorCode]);
  return {status:"failed"};
 }finally{client.release();}
}

async function failJob(jobId,errorCode){ const client=await getClient(); try{ await client.query("UPDATE delivery_jobs SET status='failed',processing_started_at=NULL,last_error_code=$2,updated_at=NOW() WHERE id=$1 AND status='processing'",[jobId,errorCode]); return {status:'failed'}; }finally{client.release();} }

module.exports={requeueFailedJob,failJob};
