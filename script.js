const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const projectData={study:{title:'Hanshit Study Library',text:'A personal study-resource space for notes, formulas, presentations and useful learning material.'},tracker:{title:'Student Habit Tracker',text:'A planned dashboard for tracking study habits, daily progress and simple visual statistics.'},c:{title:'C Programming Practice',text:'A planned collection of beginner-friendly C programs focused on logic, fundamentals and practice.'}};
const toast=$('#toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('hanshit-theme',document.body.classList.contains('dark')?'dark':'light')});
if(localStorage.getItem('hanshit-theme')==='light')document.body.classList.remove('dark');
$('#menuBtn').addEventListener('click',()=>$('#navMenu').classList.toggle('open'));
$$('#navMenu a').forEach(a=>a.addEventListener('click',()=>$('#navMenu').classList.remove('open')));
function openProject(key){const p=projectData[key];if(!p)return;$('#modalTitle').textContent=p.title;$('#modalText').textContent=p.text;$('#projectModal').hidden=false;document.body.classList.add('modal-open')}
$$('.project-btn').forEach(btn=>btn.addEventListener('click',()=>openProject(btn.dataset.project)));
function closeModal(){$('#projectModal').hidden=true;document.body.classList.remove('modal-open')}
$('#closeModal').addEventListener('click',closeModal);$('#modalAction').addEventListener('click',closeModal);$('#projectModal').addEventListener('click',e=>{if(e.target.id==='projectModal')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#projectModal').hidden)closeModal()});
const grid=$('#activityGrid');for(let i=0;i<364;i++){const cell=document.createElement('i');const wave=(i*17+i%11*7)%13;const level=wave>10?4:wave>7?3:wave>4?2:wave>2?1:0;cell.dataset.level=level;grid.appendChild(cell)}
const search=$('#librarySearch');const cards=$$('.library-card');function filterLibrary(){const term=search.value.trim().toLowerCase();let visible=0;cards.forEach(card=>{const ok=card.dataset.name.toLowerCase().includes(term);card.hidden=!ok;if(ok)visible++});$('#libraryEmpty').hidden=visible!==0}search.addEventListener('input',filterLibrary);cards.forEach(card=>card.addEventListener('click',()=>showToast(`${card.dataset.name} selected — resources can be added here.`)));
$('#year').textContent=new Date().getFullYear();