"use strict";

const { requestJson } = require("./provider-http");

const SUPPORTED_PROVIDER="configured-adapter";
const MAX_PROVIDER_BODY=100000;

class ProviderConfigurationError extends Error {
  constructor(){ super("Email provider is not configured."); this.code="PROVIDER_NOT_CONFIGURED"; }
}

class ProviderResponseError extends Error {
  constructor(code="PROVIDER_INVALID_RESPONSE"){
    super("Email provider returned an invalid response.");
    this.code=code;
  }
}

function createIdempotencyKey(jobId){
  if(!/^[0-9a-f-]{36}$/i.test(jobId)) throw new TypeError("Invalid delivery job id.");
  return `ecb:${jobId}`;
}

function requireServerConfig(){
  if(typeof window!=="undefined") throw new ProviderConfigurationError();
  const apiKey=process.env.EMAIL_PROVIDER_API_KEY;
  const endpoint=process.env.EMAIL_PROVIDER_ENDPOINT;
  if(typeof apiKey!=="string" || apiKey.length<16) throw new ProviderConfigurationError();
  if(typeof endpoint!=="string" || !/^https:\/\//i.test(endpoint)) throw new ProviderConfigurationError();
  return {apiKey,endpoint};
}

function getProvider(){
  if(process.env.EMAIL_PROVIDER!==SUPPORTED_PROVIDER) throw new ProviderConfigurationError();
  const {apiKey,endpoint}=requireServerConfig();

  return {
    name:SUPPORTED_PROVIDER,
    async send(message){
      if(!message || typeof message!=="object") throw new TypeError("Invalid provider message.");
      if(!message.idempotencyKey) throw new TypeError("Missing provider idempotency key.");
      if(!message.to || !message.subject) throw new TypeError("Incomplete provider message.");

      const payload=JSON.stringify({
        to:message.to,
        subject:message.subject,
        body:message.body||"",
        idempotencyKey:message.idempotencyKey
      });
      if(Buffer.byteLength(payload,"utf8")>MAX_PROVIDER_BODY) throw new ProviderResponseError();

      const result=await requestJson(endpoint,{
        method:"POST",
        timeoutMs:8000,
        headers:{
          "Authorization":`Bearer ${apiKey}`,
          "Content-Type":"application/json",
          "Accept":"application/json",
          "Idempotency-Key":message.idempotencyKey
        },
        body:payload
      });

      if(!result.data || typeof result.data!=="object"){
        throw new ProviderResponseError();
      }

      const accepted=result.data.accepted===true;
      const rejected=result.data.accepted===false;
      if(!accepted && !rejected) throw new ProviderResponseError("PROVIDER_INVALID_RESPONSE");
      const providerMessageId=typeof result.data.messageId==="string" ? result.data.messageId.trim() : "";
      if(accepted && !providerMessageId) throw new ProviderResponseError("PROVIDER_MESSAGE_ID_MISSING");
      if(providerMessageId.length>200) throw new ProviderResponseError("PROVIDER_MESSAGE_ID_INVALID");
      return {accepted,providerMessageId:providerMessageId||null};
    }
  };
}

function validateSendResult(result){
  if(!result || typeof result!=="object" || typeof result.accepted!=="boolean"){
    throw new ProviderResponseError();
  }
  if(result.accepted && (!result.providerMessageId || typeof result.providerMessageId!=="string")){
    throw new ProviderResponseError();
  }
  return {accepted:result.accepted,providerMessageId:result.providerMessageId || null};
}

module.exports={
  getProvider,
  createIdempotencyKey,
  validateSendResult,
  ProviderConfigurationError,
  ProviderResponseError
};
