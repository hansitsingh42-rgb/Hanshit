(() => {
"use strict";
const form=document.querySelector("#campaign-form");
const message=document.querySelector("#campaign-message");
if(!form||!message)return;
form.addEventListener("submit",event=>{
event.preventDefault();
if(!form.checkValidity()){message.textContent="Please complete the required campaign fields.";form.reportValidity();return;}
message.textContent="Campaign details validated. Email content is the next workflow step.";
});
})();