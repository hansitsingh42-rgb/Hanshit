(() => {
"use strict";
const UUID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isValidUuid=value=>typeof value==="string"&&UUID_PATTERN.test(value);
const form=document.querySelector("#edit-campaign-form"),message=document.querySelector("#edit-message"),scheduleInput=document.querySelector("#scheduled-at"),id=new URLSearchParams(window.location.search).get("id");
if(!form||!message||!isValidUuid(id)){if(message)message.textContent="Invalid campaign link.";throw new Error("Invalid campaign id");}
async function csrfToken(){const r=await fetch("../api/auth/csrf",{credentials:"same-origin"});if(!r.ok)throw new Error();const d=await r.json();if(typeof d.token!=="string")throw new Error();return d.token;}
async function loadAudiences(selected){
 const r=await fetch("../api/audiences",{credentials:"same-origin"}),d=await r.json().catch(()=>({}));
 if(r.status===401){window.location.href="./login.html";return;}
 if(!r.ok)throw new Error();
 const select=form.elements.audience;select.replaceChildren(new Option("Select a saved audience",""));
 for(const item of (Array.isArray(d.audiences)?d.audiences:[])){const o=new Option(item.name,item.id);o.dataset.name=item.name;select.append(o);}
 if(selected){for(const o of select.options)if(o.text===selected){select.value=o.value;break;}}
}
async function load(){
 try{
  const response=await fetch("../api/campaigns/"+encodeURIComponent(id),{credentials:"same-origin"});
  const data=await response.json().catch(()=>({}));
  if(response.status===401)return(window.location.href="./login.html");
  if(!response.ok)throw new Error();
  const c=data.campaign;
  form.elements.name.value=c.name;form.elements.subject.value=c.subject_line;form.elements.status.value=c.status;
  if(scheduleInput){scheduleInput.disabled=c.status!=="scheduled";if(c.scheduled_at)scheduleInput.value=new Date(c.scheduled_at).toISOString().slice(0,16);}
  await loadAudiences(c.audience);
 }catch{message.textContent="Campaign could not be loaded.";}
}
form.elements.status.addEventListener("change",()=>{if(scheduleInput)scheduleInput.disabled=form.elements.status.value!=="scheduled";});
form.addEventListener("submit",async event=>{
 event.preventDefault();if(!form.checkValidity()){form.reportValidity();return;}
 const button=form.querySelector("button");button.disabled=true;
 try{
  const token=await csrfToken();
  const response=await fetch("../api/campaigns/"+encodeURIComponent(id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({name:form.elements.name.value,subjectLine:form.elements.subject.value,audience:form.elements.audience.options[form.elements.audience.selectedIndex]?.text||"",status:form.elements.status.value})});
  const d=await response.json().catch(()=>({}));
  if(!response.ok){message.textContent=d.error||"Campaign could not be updated.";return;}
  const assign=await fetch("../api/campaigns/audience?id="+encodeURIComponent(id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({audienceId:form.elements.audience.value})});
  if(assign.ok){
    const lifecycle=await fetch("../api/campaigns/schedule?id="+encodeURIComponent(id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({status:form.elements.status.value,scheduledAt:scheduleInput?.value?new Date(scheduleInput.value).toISOString():null})});
    const lifecycleData=await lifecycle.json().catch(()=>({}));
    if(!lifecycle.ok){message.textContent=lifecycleData.error||"Campaign status could not be saved.";return;}
  }
  const a=await assign.json().catch(()=>({}));
  if(!assign.ok){message.textContent=a.error||"Audience could not be attached.";return;}
  message.textContent="Campaign and audience saved.";
 }catch{message.textContent="Campaign service unavailable.";}
 finally{button.disabled=false;}
});
load();
})();