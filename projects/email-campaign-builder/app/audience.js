(() => {
"use strict";
const UUID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isValidUuid=value=>typeof value==="string"&&UUID_PATTERN.test(value);
const isValidSegment=item=>item&&isValidUuid(item.id)&&typeof item.name==="string"&&typeof item.source==="string"&&typeof item.condition==="string";
const isValidContact=item=>item&&isValidUuid(item.id)&&typeof item.email==="string"&&typeof item.status==="string"&&(item.name===null||typeof item.name==="string");
const form=document.querySelector("#segment-form"),name=document.querySelector("#segment-name"),source=document.querySelector("#source"),condition=document.querySelector("#condition"),message=document.querySelector("#segment-message"),list=document.querySelector("#segments");
const contactForm=document.querySelector("#contact-form"),contactSegment=document.querySelector("#contact-segment"),contactName=document.querySelector("#contact-name"),contactEmail=document.querySelector("#contact-email"),contactConsent=document.querySelector("#contact-consent"),contactMessage=document.querySelector("#contact-message"),contactFilter=document.querySelector("#contact-filter"),contacts=document.querySelector("#contacts"),contactsMessage=document.querySelector("#contacts-message");
let segments=[];

if(!form||!list||!contactForm||!contacts)return;

async function csrfToken(){const response=await fetch("../api/auth/csrf",{credentials:"same-origin"});if(!response.ok)throw new Error();const data=await response.json();if(typeof data.token!=="string")throw new Error();return data.token;}
function authRedirect(response){if(response.status===401){window.location.href="./login.html";return true;}return false;}
function renderSegments(items){
 segments=items;
 list.replaceChildren(); contactSegment.replaceChildren(); contactFilter.replaceChildren();
 const empty=document.createElement("option");empty.value="";empty.textContent="Choose a saved segment";contactSegment.append(empty);
 const all=document.createElement("option");all.value="";all.textContent="All contacts";contactFilter.append(all);
 for(const item of items){
  if(!isValidSegment(item))continue;
  const article=document.createElement("article");article.className="segment-item";
  const info=document.createElement("div"),title=document.createElement("strong"),detail=document.createElement("p"),status=document.createElement("span");
  title.textContent=item.name;detail.textContent=item.source+" · "+item.condition;status.className="status";status.textContent="Active";info.append(title,detail);article.append(info,status);list.append(article);
  const option=document.createElement("option");option.value=item.id;option.textContent=item.name;contactSegment.append(option);
  const filter=document.createElement("option");filter.value=item.id;filter.textContent=item.name;contactFilter.append(filter);
 }
 if(!items.length)message.textContent="No saved audiences yet.";
}
async function loadSegments(){
 try{const response=await fetch("../api/audiences",{credentials:"same-origin"});const data=await response.json().catch(()=>({}));if(authRedirect(response))return;if(!response.ok)throw new Error();renderSegments(Array.isArray(data.audiences)?data.audiences:[]);}
 catch{message.textContent="Audience service unavailable.";}
}
function renderContacts(items){
 contacts.replaceChildren();
 for(const item of items){
  if(!isValidContact(item))continue;
  const article=document.createElement("article");article.className="segment-item";
  const info=document.createElement("div"),title=document.createElement("strong"),detail=document.createElement("p"),status=document.createElement("span");
  title.textContent=item.email;detail.textContent=(item.name||"No name")+" · consent recorded";status.className="status";status.textContent=item.status;
  info.append(title,detail);
  if(item.status==="subscribed"){const button=document.createElement("button");button.type="button";button.className="button";button.textContent="Unsubscribe";button.addEventListener("click",()=>updateStatus(item.id,"unsubscribed",button));info.append(button);}
  article.append(info,status);contacts.append(article);
 }
 if(!items.length)contactsMessage.textContent="No contacts in this view.";
}
async function loadContacts(){
 const segmentId=contactFilter.value;const url=segmentId?"../api/contacts?segmentId="+encodeURIComponent(segmentId):"../api/contacts";
 try{const response=await fetch(url,{credentials:"same-origin"});const data=await response.json().catch(()=>({}));if(authRedirect(response))return;if(!response.ok)throw new Error();contactsMessage.textContent="";renderContacts(Array.isArray(data.contacts)?data.contacts:[]);}
 catch{contactsMessage.textContent="Contact service unavailable.";}
}
async function updateStatus(id,status,button){
 button.disabled=true;
 try{const token=await csrfToken();const response=await fetch("../api/contacts/status?id="+encodeURIComponent(id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({status})});if(authRedirect(response))return;if(!response.ok)throw new Error();await loadContacts();}
 catch{contactsMessage.textContent="Contact status could not be updated.";}
 finally{button.disabled=false;}
}
form.addEventListener("submit",async event=>{
 event.preventDefault();if(!form.checkValidity()){message.textContent="Complete all segment fields before adding a segment.";form.reportValidity();return;}
 const button=form.querySelector("button");button.disabled=true;
 try{const token=await csrfToken();const response=await fetch("../api/audiences/create",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({name:name.value,source:source.value,condition:condition.value})});const data=await response.json().catch(()=>({}));if(authRedirect(response))return;if(!response.ok){message.textContent=data.error||"Audience could not be saved.";return;}message.textContent="Audience saved.";form.reset();await loadSegments();}
 catch{message.textContent="Audience service unavailable.";}
 finally{button.disabled=false;}
});
contactForm.addEventListener("submit",async event=>{
 event.preventDefault();if(!contactForm.checkValidity()){contactMessage.textContent="Choose a segment, enter a valid email, and confirm permission.";contactForm.reportValidity();return;}
 const button=contactForm.querySelector("button");button.disabled=true;
 try{const token=await csrfToken();const response=await fetch("../api/contacts/create",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({segmentId:contactSegment.value,name:contactName.value,email:contactEmail.value,consent:contactConsent.checked})});const data=await response.json().catch(()=>({}));if(authRedirect(response))return;if(!response.ok){contactMessage.textContent=data.error||"Contact could not be saved.";return;}contactMessage.textContent="Contact added.";contactForm.reset();await loadContacts();}
 catch{contactMessage.textContent="Contact service unavailable.";}
 finally{button.disabled=false;}
});
contactFilter.addEventListener("change",loadContacts);
loadSegments().then(loadContacts);
})();