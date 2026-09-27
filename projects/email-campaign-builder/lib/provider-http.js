"use strict";

class ProviderHttpError extends Error {
  constructor(message,code="PROVIDER_HTTP_ERROR",retryable=false){
    super(message);
    this.code=code;
    this.retryable=retryable;
  }
}

async function requestJson(url,options={}){
  if(typeof url!=="string" || !/^https:\/\//i.test(url)){
    throw new ProviderHttpError("Invalid provider endpoint.","INVALID_PROVIDER_ENDPOINT",false);
  }

  const timeoutMs=Math.min(Math.max(Number(options.timeoutMs)||8000,1000),15000);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);

  try{
    const response=await fetch(url,{
      method:options.method||"POST",
      headers:options.headers||{},
      body:options.body,
      signal:controller.signal,
      redirect:"error"
    });

    const text=await response.text();
    let data=null;
    if(text){
      try{data=JSON.parse(text);}catch{throw new ProviderHttpError("Invalid provider response.","INVALID_PROVIDER_RESPONSE",false);}
    }

    if(!response.ok){
      const retryable=response.status===408 || response.status===425 || response.status===429 || response.status>=500;
      throw new ProviderHttpError("Provider request failed.","PROVIDER_HTTP_"+response.status,retryable);
    }

    return {status:response.status,data};
  }catch(error){
    if(error.name==="AbortError") throw new ProviderHttpError("Provider request timed out.","PROVIDER_TIMEOUT",true);
    if(error instanceof ProviderHttpError) throw error;
    throw new ProviderHttpError("Provider request failed.","PROVIDER_NETWORK_ERROR",true);
  }finally{
    clearTimeout(timer);
  }
}

module.exports={requestJson,ProviderHttpError};
