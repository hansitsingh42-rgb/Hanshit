const screens=[...document.querySelectorAll(".screen")],nav=[...document.querySelectorAll(".nav")];
function show(id){if(!screens.some(s=>s.id===id))return;screens.forEach(s=>s.classList.toggle("active",s.id===id));nav.forEach(n=>n.classList.toggle("active",n.dataset.screen===id));}
document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.screen)));
document.getElementById("date").textContent=new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(new Date());
document.getElementById("theme").addEventListener("click",()=>document.body.classList.toggle("dark"));
let seconds=1500,run=false,tick;const timer=document.getElementById("timer"),start=document.getElementById("start");
function render(){timer.textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");timer.setAttribute("aria-label",timer.textContent+" remaining")}
start.onclick=()=>{run=!run;start.textContent=run?"Pause":"Start";start.setAttribute("aria-pressed",String(run));if(run)tick=setInterval(()=>{if(seconds>0){seconds--;render()}else{run=false;start.textContent="Start";start.setAttribute("aria-pressed","false");clearInterval(tick)}},1000);else clearInterval(tick)};
document.getElementById("reset").onclick=()=>{clearInterval(tick);seconds=1500;run=false;start.textContent="Start";start.setAttribute("aria-pressed","false");render()};
render();