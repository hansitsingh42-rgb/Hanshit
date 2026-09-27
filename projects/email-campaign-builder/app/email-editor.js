(() => {
"use strict";
const UUID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;const isValidUuid=value=>typeof value==="string"&&UUID_PATTERN.test(value);
const form=document.querySelector("#email-editor-form"),template=document.querySelector("#template"),headline=document.querySelector("#headline"),body=document.querySelector("#body"),cta=document.querySelector("#cta"),previewHeadline=document.querySelector("#preview-headline"),previewBody=document.querySelector("#preview-body"),previewCta=document.querySelector("#preview-cta"),message=document.querySelector("#editor-message");
if(!form||!template||!headline||!body||!cta||!previewHeadline||!previewBody||!previewCta||!message)return;

const id=new URLSearchParams(window.location.search).get("id");
const validId=isValidUuid(id);

const update=()=>{
  previewHeadline.textContent=headline.value.trim()||"Your headline appears here";
  previewBody.textContent=body.value.trim()||"Your email message will appear here as you type.";
  previewCta.textContent=cta.value.trim()||"Learn more";
};

async function csrfToken(){
  const response=await fetch("../api/auth/csrf",{credentials:"same-origin"});
  if(!response.ok)throw new Error();
  const data=await response.json();
  if(typeof data.token!=="string")throw new Error();
  return data.token;
}

async function load(){
  if(!validId){message.textContent="Open the email editor from a campaign.";return;}
  try{
    const response=await fetch("../api/campaigns/content?id="+encodeURIComponent(id),{credentials:"same-origin"});
    const data=await response.json().catch(()=>({}));
    if(response.status===401){window.location.href="./login.html";return;}
    if(response.status===404)return;
    if(!response.ok)throw new Error();
    if(data.content){
      const content=data.content;
      if(typeof content!=="object"||Array.isArray(content)||typeof content.template!=="string"||typeof content.headline!=="string"||typeof content.body_text!=="string"||typeof content.cta_text!=="string")throw new Error();
      template.value=content.template;
      headline.value=content.headline;
      body.value=content.body_text;
      cta.value=content.cta_text;
      update();
    }
  }catch{message.textContent="Email content could not be loaded.";}
}

[headline,body,cta].forEach(input=>input.addEventListener("input",update));
form.addEventListener("submit",async event=>{
  event.preventDefault();
  update();
  if(!form.checkValidity()){message.textContent="Please complete the required template, headline, and message fields.";form.reportValidity();return;}
  if(!validId){message.textContent="A valid campaign is required.";return;}
  const button=form.querySelector("button[type=submit]");button.disabled=true;
  try{
    const token=await csrfToken();
    const response=await fetch("../api/campaigns/content?id="+encodeURIComponent(id),{
      method:"PATCH",credentials:"same-origin",
      headers:{"Content-Type":"application/json","X-CSRF-Token":token},
      body:JSON.stringify({template:template.value,headline:headline.value,body:body.value,cta:cta.value})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok){message.textContent=data.error||"Email content could not be saved.";return;}
    message.textContent="Email content saved.";
  }catch{message.textContent="Email content service unavailable.";}
  finally{button.disabled=false;}
});
update();
load();
})();