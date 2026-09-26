(() => {
"use strict";
const form=document.querySelector("#campaign-form"),message=document.querySelector("#campaign-message"),audience=document.querySelector("#audience");
if(!form||!message||!audience)return;

async function csrfToken(){const r=await fetch("../api/auth/csrf",{credentials:"same-origin"});if(!r.ok)throw new Error();const d=await r.json();if(typeof d.token!=="string")throw new Error();return d.token;}
async function loadAudiences(){
 try{
  const r=await fetch("../api/audiences",{credentials:"same-origin"}),d=await r.json().catch(()=>({}));
  if(r.status===401){window.location.href="./login.html";return;}
  if(!r.ok)throw new Error();
  audience.replaceChildren(new Option("Select a saved audience",""));
  for(const item of (Array.isArray(d.audiences)?d.audiences:[])) audience.append(new Option(item.name,item.id));
 }catch{message.textContent="Audience service unavailable.";}
}
form.addEventListener("submit",async event=>{
 event.preventDefault();
 if(!form.checkValidity()){message.textContent="Please complete the required campaign fields.";form.reportValidity();return;}
 const button=form.querySelector("button[type=submit]");button.disabled=true;
 try{
  const token=await csrfToken();
  const create=await fetch("../api/campaigns/create",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({
   name:form.elements.name.value,subjectLine:form.elements.subject.value,audience:audience.options[audience.selectedIndex]?.text||"",status:form.elements.schedule.value==="Schedule later"?"scheduled":"draft"
  })});
  const created=await create.json().catch(()=>({}));
  if(!create.ok){message.textContent=created.error||"Campaign could not be created.";return;}
  const assign=await fetch("../api/campaigns/audience?id="+encodeURIComponent(created.campaign.id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({audienceId:audience.value})});
  const assigned=await assign.json().catch(()=>({}));
  if(!assign.ok){message.textContent=assigned.error||"Audience could not be attached.";return;}
  window.location.href="./email-editor.html?id="+encodeURIComponent(created.campaign.id);
 }catch{message.textContent="Campaign service unavailable.";}
 finally{button.disabled=false;}
});
loadAudiences();
})();