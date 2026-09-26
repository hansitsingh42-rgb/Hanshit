"use strict";

const MAX_ATTEMPTS=10;
const BACKOFF_MINUTES=[1,5,15,30,60,120,240,480,720];

function nextRetryDelayMinutes(attempts){
 const index=Math.max(0,Math.min(BACKOFF_MINUTES.length-1,Number(attempts)-1));
 return BACKOFF_MINUTES[index];
}

function retryable(attempts){
 return Number(attempts)<MAX_ATTEMPTS;
}

module.exports={MAX_ATTEMPTS,nextRetryDelayMinutes,retryable};
