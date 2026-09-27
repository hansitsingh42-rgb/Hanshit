"use strict";

const UUID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value){
  return typeof value==="string" && UUID_PATTERN.test(value);
}

function boundedString(value,max,{required=false}={}){
  if(typeof value!=="string")return required?null:"";
  const normalized=value.trim();
  if(required && !normalized)return null;
  if(normalized.length>max)return null;
  return normalized;
}

function isPlainObject(value){
  return Boolean(value) && typeof value==="object" && !Array.isArray(value);
}

module.exports={isUuid,boundedString,isPlainObject};
