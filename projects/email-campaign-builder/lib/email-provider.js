"use strict";

const SUPPORTED_PROVIDER="configured-adapter";

class ProviderConfigurationError extends Error {
  constructor(){ super("Email provider is not configured."); this.code="PROVIDER_NOT_CONFIGURED"; }
}

class ProviderResponseError extends Error {
  constructor(){ super("Email provider returned an invalid response."); this.code="PROVIDER_INVALID_RESPONSE"; }
}

function createIdempotencyKey(jobId){
  if(!/^[0-9a-f-]{36}$/i.test(jobId)) throw new TypeError("Invalid delivery job id.");
  return `ecb:${jobId}`;
}

function requireServerConfig(){
  if(typeof window!=="undefined") throw new ProviderConfigurationError();
  const apiKey=process.env.EMAIL_PROVIDER_API_KEY;
  if(typeof apiKey!=="string" || apiKey.length<16) throw new ProviderConfigurationError();
  return {apiKey};
}

function getProvider(){
  if(process.env.EMAIL_PROVIDER!==SUPPORTED_PROVIDER) throw new ProviderConfigurationError();
  const {apiKey}=requireServerConfig();

  return {
    name:SUPPORTED_PROVIDER,
    async send(message){
      if(!message || typeof message!=="object") throw new TypeError("Invalid provider message.");
      if(!message.idempotencyKey) throw new TypeError("Missing provider idempotency key.");
      if(!message.to || !message.subject) throw new TypeError("Incomplete provider message.");

      void apiKey;
      throw new ProviderConfigurationError();
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
