(() => {
"use strict";
const form=document.querySelector("#edit-campaign-form"),message=document.querySelector("#edit-message"),id=new URLSearchParams(window.location.search).get("id");
if(!form||!message||!/^[0-9a-f-]{36}$/i.test(id||"")){if(message)message.textContent="Invalid campaign link.";throw new Error("Invalid campaign id");}
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
  await loadAudiences(c.audience);
 }catch{message.textContent="Campaign could not be loaded.";}
}
form.addEventListener("submit",async event=>{
 event.preventDefault();if(!form.checkValidity()){form.reportValidity();return;}
 const button=form.querySelector("button");button.disabled=true;
 try{
  const token=await csrfToken();
  const response=await fetch("../api/campaigns/"+encodeURIComponent(id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({name:form.elements.name.value,subjectLine:form.elements.subject.value,audience:form.elements.audience.options[form.elements.audience.selectedIndex]?.text||"",status:form.elements.status.value})});
  const d=await response.json().catch(()=>({}));
  if(!response.ok){message.textContent=d.error||"Campaign could not be updated.";return;}
  const assign=await fetch("../api/campaigns/audience?id="+encodeURIComponent(id),{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":token},body:JSON.stringify({audienceId:form.elements.audience.value})});
  const a=await assign.json().catch(()=>({}));
  if(!assign.ok){message.textContent=a.error||"Audience could not be attached.";return;}
  message.textContent="Campaign and audience saved.";
 }catch{message.textContent="Campaign service unavailable.";}
 finally{button.disabled=false;}
});
load();
})();