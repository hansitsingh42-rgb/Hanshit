"use strict";

const crypto = require("node:crypto");

class ProviderConfigurationError extends Error {
  constructor(){
    super("Email provider is not configured.");
    this.code="PROVIDER_NOT_CONFIGURED";
  }
}

class ProviderResponseError extends Error {
  constructor(){
    super("Email provider returned an invalid response.");
    this.code="PROVIDER_INVALID_RESPONSE";
  }
}

function createIdempotencyKey(jobId){
  if(!/^[0-9a-f-]{36}$/i.test(jobId)) throw new TypeError("Invalid delivery job id.");
  return `ecb:${jobId}`;
}

function getProvider(){
  const name=process.env.EMAIL_PROVIDER;
  if(!name) throw new ProviderConfigurationError();
  if(name!=="configured-adapter") throw new Error("Unsupported email provider.");

  return {
    name,
    async send(message){
      if(!message || typeof message!=="object") throw new TypeError("Invalid provider message.");
      if(!message.idempotencyKey) throw new TypeError("Missing provider idempotency key.");
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
  return {
    accepted: result.accepted,
    providerMessageId: result.providerMessageId || null
  };
}

module.exports={
  getProvider,
  createIdempotencyKey,
  validateSendResult,
  ProviderConfigurationError,
  ProviderResponseError
};
