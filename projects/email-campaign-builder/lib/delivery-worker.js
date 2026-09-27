"use strict";

const { createIdempotencyKey, getProvider, validateSendResult } = require("./email-provider");
const { getClient } = require("./auth");
const { requeueFailedJob } = require("./delivery-recovery");

async function processClaimedJob(jobId){
  if(!/^[0-9a-f-]{36}$/i.test(jobId)) throw new TypeError("Invalid delivery job id.");

  const client=await getClient();
  try{
    await client.query("BEGIN");

    const job=await client.query(
      "SELECT d.id,d.campaign_id,d.contact_id,d.status,d.attempts,d.provider_idempotency_key,c.subject_line,c.headline,c.body_text,ac.email,ac.status AS contact_status FROM delivery_jobs d JOIN campaigns c ON c.id=d.campaign_id JOIN audience_contacts ac ON ac.id=d.contact_id WHERE d.id=$1 FOR UPDATE",
      [jobId]
    );

    const row=job.rows[0];
    if(!row) throw new Error("Delivery job not found.");
    if(row.status!=="processing") throw new Error("Delivery job is not claimed.");

    if(row.contact_status!=="subscribed"){
      await client.query(
        "UPDATE delivery_jobs SET status='cancelled',last_error_code='CONTACT_NOT_SUBSCRIBED',processing_started_at=NULL,updated_at=NOW() WHERE id=$1",
        [jobId]
      );
      await client.query("COMMIT");
      return {status:"cancelled",code:"CONTACT_NOT_SUBSCRIBED"};
    }

    const idempotencyKey=row.provider_idempotency_key || createIdempotencyKey(row.id);

    await client.query(
      "UPDATE delivery_jobs SET provider_idempotency_key=$2,updated_at=NOW() WHERE id=$1 AND provider_idempotency_key IS NULL",
      [jobId,idempotencyKey]
    );
    await client.query("COMMIT");

    const provider=getProvider();
    const result=validateSendResult(await provider.send({
      jobId:row.id,
      campaignId:row.campaign_id,
      contactId:row.contact_id,
      to:row.email,
      subject:row.subject_line,
      body:row.body_text || row.headline || "",
      idempotencyKey
    }));

    const finalize=await getClient();
    try{
      await finalize.query(
        "UPDATE delivery_jobs SET status=$2,provider_message_id=$3,processing_started_at=NULL,last_error_code=NULL,updated_at=NOW() WHERE id=$1 AND status='processing' AND provider_idempotency_key=$4",
        [jobId,result.accepted ? "sent" : "failed",result.providerMessageId,idempotencyKey]
      );
    }finally{
      finalize.release();
    }

    return {status:result.accepted ? "sent" : "failed",providerMessageId:result.providerMessageId};
  }catch(error){
    try{await client.query("ROLLBACK");}catch{}
    if(error?.retryable && error?.code){
      try{
        return await requeueFailedJob(jobId, row?.attempts || 1, error.code);
      }catch{
        throw error;
      }
    }
    throw error;
  }finally{
    client.release();
  }
}

module.exports={processClaimedJob};
