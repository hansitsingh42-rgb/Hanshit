(() => {
"use strict";
const form=document.querySelector("#segment-form"),name=document.querySelector("#segment-name"),source=document.querySelector("#source"),condition=document.querySelector("#condition"),message=document.querySelector("#segment-message"),list=document.querySelector("#segments");
if(!form||!name||!source||!condition||!message||!list)return;

async function csrfToken(){
 const response=await fetch("../api/auth/csrf",{credentials:"same-origin"});
 if(!response.ok)throw new Error();
 const data=await response.json();
 if(typeof data.token!=="string")throw new Error();
 return data.token;
}
function render(items){
 list.replaceChildren();
 for(const item of items){
  const article=document.createElement("article");article.className="segment-item";
  const info=document.createElement("div"),title=document.createElement("strong"),detail=document.createElement("p"),status=document.createElement("span");
  title.textContent=item.name;detail.textContent=item.source+" · "+item.condition;status.className="status";status.textContent="Active";
  info.append(title,detail);article.append(info,status);list.append(article);
 }
 if(!items.length)message.textContent="No saved audiences yet.";
}
async function load(){
 try{
  const response=await fetch("../api/audiences",{credentials:"same-origin"}),data=await response.json().catch(()=>({}));
  if(response.status===401){window.location.href="./login.html";return;}
  if(!response.ok)throw new Error();
  render(Array.isArray(data.audiences)?data.audiences:[]);
 }catch{message.textContent="Audience service unavailable.";}
}
form.addEventListener("submit",async event=>{
 event.preventDefault();
 if(!form.checkValidity()){message.textContent="Complete all segment fields before adding a segment.";form.reportValidity();return;}
 const button=form.querySelector("button");button.disabled=true;
 try{
  const token=await csrfToken();
  const response=await fetch("../api/audiences/create",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({name:name.value,source:source.value,condition:condition.value})});
  const data=await response.json().catch(()=>({}));
  if(response.status===401){window.location.href="./login.html";return;}
  if(!response.ok){message.textContent=data.error||"Audience could not be saved.";return;}
  message.textContent="Audience saved.";form.reset();load();
 }catch{message.textContent="Audience service unavailable.";}
 finally{button.disabled=false;}
});
load();
})();