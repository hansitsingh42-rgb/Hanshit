(() => {
"use strict";
const form=document.querySelector("#email-editor-form"),template=document.querySelector("#template"),headline=document.querySelector("#headline"),body=document.querySelector("#body"),cta=document.querySelector("#cta"),previewHeadline=document.querySelector("#preview-headline"),previewBody=document.querySelector("#preview-body"),previewCta=document.querySelector("#preview-cta"),message=document.querySelector("#editor-message");
if(!form||!template||!headline||!body||!cta||!previewHeadline||!previewBody||!previewCta||!message)return;
const update=()=>{previewHeadline.textContent=headline.value.trim()||"Your headline appears here";previewBody.textContent=body.value.trim()||"Your email message will appear here as you type.";previewCta.textContent=cta.value.trim()||"Learn more";};
[headline,body,cta].forEach(input=>input.addEventListener("input",update));
form.addEventListener("submit",event=>{event.preventDefault();update();if(!form.checkValidity()){message.textContent="Please complete the required template, headline, and message fields.";form.reportValidity();return;}message.textContent="Preview ready. Production email sending is not connected in this stage.";});
update();
})();