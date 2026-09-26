(() => {
"use strict";
const form=document.querySelector("#email-editor-form"),template=document.querySelector("#template"),headline=document.querySelector("#headline"),body=document.querySelector("#body"),cta=document.querySelector("#cta"),previewHeadline=document.querySelector("#preview-headline"),previewBody=document.querySelector("#preview-body"),previewCta=document.querySelector("#preview-cta"),message=document.querySelector("#editor-message");
if(!form||!template||!headline||!body||!cta||!previewHeadline||!previewBody||!previewCta||!message)return;

const id=new URLSearchParams(window.location.search).get("id");
const validId=/^[0-9a-f-]{36}$/i.test(id||"");

const update=()=>{
  previewHeadline.textContent=headline.value.trim()||"Your headline appears here";
  previewBody.textContent=body.value.trim()||"Your email message will appear here as you type.";
  previewCta.textContent=cta.value.trim()||"Learn more";
};

async function load(){
  if(!validId){message.textContent="Open the email editor from a campaign.";return;}
  try{
    const response=await fetch("../api/campaigns/content?id="+encodeURIComponent(id),{credentials:"same-origin"});
    const data=await response.json().catch(()=>({}));
    if(response.status===401){window.location.href="./login.html";return;}
    if(response.status===404)return;
    if(!response.ok)throw new Error();
    if(data.content){
      template.value=data.content.template||"";
      headline.value=data.content.headline||"";
      body.value=data.content.body_text||"";
      cta.value=data.content.cta_text||"";
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
    const response=await fetch("../api/campaigns/content?id="+encodeURIComponent(id),{
      method:"PATCH",credentials:"same-origin",
      headers:{"Content-Type":"application/json"},
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