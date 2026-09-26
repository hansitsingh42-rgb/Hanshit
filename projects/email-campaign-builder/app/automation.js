(() => {
"use strict";
const form=document.querySelector("#automation-form");
const trigger=document.querySelector("#trigger");
const delay=document.querySelector("#delay");
const action=document.querySelector("#action");
const message=document.querySelector("#automation-message");
const workflow=document.querySelector("#workflow");
if(!form||!trigger||!delay||!action||!message||!workflow)return;
let step=1;
form.addEventListener("submit",event=>{
event.preventDefault();
if(!form.checkValidity()){message.textContent="Complete all workflow fields before adding a step.";form.reportValidity();return;}
if(step===1)workflow.replaceChildren();
step+=1;
const item=document.createElement("div"); item.className="workflow-step";
const number=document.createElement("span"); number.className="workflow-number"; number.textContent=String(step);
const content=document.createElement("div");
const title=document.createElement("strong"); title.textContent=action.value;
const detail=document.createElement("p"); detail.textContent=trigger.value+" · "+delay.value;
content.append(title,detail); item.append(number,content); workflow.append(item);
message.textContent="Workflow step added locally. No automated email will be sent from this demo.";
form.reset();
});
})();