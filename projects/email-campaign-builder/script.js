(() => {
"use strict";
const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector("#primary-nav");
if(!menuButton||!nav)return;
const closeMenu=()=>{nav.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation");};
menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});
})();