const screens=[...document.querySelectorAll(".screen")];
const nav=[...document.querySelectorAll(".nav")];
const focusState=document.getElementById("focus-state");
const plannerState=document.getElementById("planner-state");
const PLAN_KEY="student-study-planner-v1";
const defaultSessions={Mon:["Mathematics · 45 min"],Tue:["Networks · 60 min"],Wed:["Mathematics · 45 min"],Thu:["Networks · 60 min"],Fri:["Mathematics · 45 min"],Sat:["Networks · 60 min"],Sun:["Mathematics · 45 min"]};
let sessions=(()=>{try{return {...defaultSessions,...JSON.parse(localStorage.getItem(PLAN_KEY)||"{}")}}catch{return {...defaultSessions}}})();
function savePlan(){try{localStorage.setItem(PLAN_KEY,JSON.stringify(sessions))}catch{}}
function renderPlan(){document.querySelectorAll(".day").forEach(day=>{const key=day.querySelector("b")?.textContent;if(!key)return;const task=day.querySelector(".task");const value=(sessions[key]||[])[0]||"No session planned";if(task){task.firstChild.textContent=value.split(" · ")[0]||value;const small=task.querySelector("small");if(small)small.textContent=value.includes(" · ")?value.split(" · ").slice(1).join(" · "):""}})}
renderPlan();
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
    const label=button.getAttribute("aria-label")||"Add session";
    const day=label.match(/on (Mon|Tue|Wed|Thu|Fri|Sat|Sun)/)?.[1]||"Tue";
    const current=(sessions[day]||[])[0];
    const next=current==="Revision · 30 min"?"Practice · 45 min":"Revision · 30 min";
    sessions[day]=[next];
    savePlan();
    renderPlan();
    plannerState.hidden=false;
    plannerState.textContent=`${day}: ${next} saved locally. Click again to switch the planned session.`;
  });
});
renderTimer();