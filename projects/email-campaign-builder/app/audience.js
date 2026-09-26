(() => {
"use strict";
const form=document.querySelector("#segment-form");
const name=document.querySelector("#segment-name");
const source=document.querySelector("#source");
const condition=document.querySelector("#condition");
const message=document.querySelector("#segment-message");
const list=document.querySelector("#segments");
if(!form||!name||!source||!condition||!message||!list)return;
form.addEventListener("submit",event=>{
event.preventDefault();
if(!form.checkValidity()){message.textContent="Complete all segment fields before adding a segment.";form.reportValidity();return;}
const article=document.createElement("article");
article.className="segment-item";
const info=document.createElement("div");
const title=document.createElement("strong");
const detail=document.createElement("p");
const status=document.createElement("span");
title.textContent=name.value.trim();
detail.textContent=source.value+" · "+condition.value;
status.className="status";
status.textContent="Draft";
info.append(title,detail);
article.append(info,status);
list.append(article);
message.textContent="Segment added locally for this demo. It has not been saved or transmitted.";
form.reset();
});
})();