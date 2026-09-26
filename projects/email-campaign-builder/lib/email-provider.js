"use strict";

class ProviderConfigurationError extends Error {
  constructor(){ super("Email provider is not configured."); this.code="PROVIDER_NOT_CONFIGURED"; }
}

function getProvider(){
  const name=process.env.EMAIL_PROVIDER;
  if(!name) throw new ProviderConfigurationError();
  if(name!=="configured-adapter") throw new Error("Unsupported email provider.");
  return {
    async send(){ throw new ProviderConfigurationError(); }
  };
}

module.exports={getProvider,ProviderConfigurationError};
