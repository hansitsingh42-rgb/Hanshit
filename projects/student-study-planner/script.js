const screens=[...document.querySelectorAll(".screen")];
const nav=[...document.querySelectorAll(".nav")];
const focusState=document.getElementById("focus-state");
const plannerState=document.getElementById("planner-state");
function show(id){
  const target=screens.find(s=>s.id===id);
  if(!target)return;
  screens.forEach(s=>s.classList.toggle("active",s===target));
  nav.forEach(n=>{
    const active=n.dataset.screen===id;
    n.classList.toggle("active",active);
    if(active)n.setAttribute("aria-current","page");else n.removeAttribute("aria-current");
  });
  target.querySelector("h1")?.focus?.({preventScroll:true});
}
document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.screen)));
document.getElementById("date").textContent=new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(new Date());

const theme=document.getElementById("theme");
theme.addEventListener("click",()=>{
  const dark=document.body.classList.toggle("dark");
  theme.setAttribute("aria-pressed",String(dark));
  theme.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
});

let seconds=1500;
let running=false;
let tick=null;
const timer=document.getElementById("timer");
const start=document.getElementById("start");
const reset=document.getElementById("reset");

function renderTimer(){
  const value=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
  timer.textContent=value;
  timer.setAttribute("aria-label",value+" remaining");
}
function stopTimer(){
  if(tick!==null){clearInterval(tick);tick=null;}
  running=false;
  start.textContent="Start";
  start.setAttribute("aria-pressed","false");
}
function completeTimer(){
  stopTimer();
  focusState.textContent="Session complete. Take a short break before the next task.";
}
start.addEventListener("click",()=>{
  if(seconds===0){seconds=1500;renderTimer();}
  running=!running;
  start.textContent=running?"Pause":"Start";
  start.setAttribute("aria-pressed",String(running));
  focusState.textContent=running?"Focus session running.":"Focus session paused.";
  if(running){
    tick=setInterval(()=>{
      if(seconds>0){seconds--;renderTimer();}
      if(seconds===0)completeTimer();
    },1000);
  }else if(tick!==null){clearInterval(tick);tick=null;}
});
reset.addEventListener("click",()=>{
  stopTimer();
  seconds=1500;
  renderTimer();
  focusState.textContent="Timer reset. Ready when you are.";
});
document.querySelectorAll(".add").forEach(button=>{
  button.addEventListener("click",()=>{
    plannerState.hidden=false;
    plannerState.textContent=button.getAttribute("aria-label")+" is ready for a session. This prototype does not save the change.";
  });
});
renderTimer();