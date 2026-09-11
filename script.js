const resources=[
 {title:'Computer Networks — PAN, LAN, MAN, WAN & CAN',subject:'Computer Science',type:'Notes',icon:'⌘',text:'Quick notes covering the network types currently being studied.'},
 {title:'Engineering Mechanics — Basic Concepts',subject:'Mechanics',type:'Notes',icon:'⚙',text:'Definitions, branches, rigid body and basic force concepts.'},
 {title:'Physics Formula Quick Sheet',subject:'Physics',type:'PDF',icon:'Φ',text:'A future home for chapter-wise physics formulas.'},
 {title:'Chemistry Revision Notes',subject:'Chemistry',type:'PDF',icon:'⚗',text:'A future home for concise chemistry revision material.'},
 {title:'Mathematics Practice Set',subject:'Mathematics',type:'PPT',icon:'∑',text:'Practice questions and examples will be organized here.'},
 {title:'English Communication Skills',subject:'English',type:'Video',icon:'Aa',text:'Useful communication and grammar learning material.'}
];
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2500)}
function filterSubjects(){const term=$('#search').value.trim().toLowerCase();const active=$('.filter.active').dataset.filter;let visible=0;$$('.subject-card').forEach(card=>{const ok=(active==='all'||card.dataset.category===active)&&(!term||card.dataset.name.toLowerCase().includes(term));card.hidden=!ok;if(ok)visible++});$('#emptyState').hidden=visible!==0}
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');filterSubjects()}));
$('#search').addEventListener('input',filterSubjects);
function renderResources(){const term=$('#resourceSearch').value.trim().toLowerCase();const type=$('#typeFilter').value;const list=resources.filter(r=>(type==='all'||r.type===type)&&(!term||`${r.title} ${r.subject} ${r.type}`.toLowerCase().includes(term)));$('#resourceGrid').innerHTML=list.map((r,i)=>`<article class="resource-item"><div class="resource-main"><span class="resource-icon">${r.icon}</span><div><strong>${r.title}</strong><p>${r.subject} · ${r.type}</p><p>${r.text}</p></div></div><button class="open-resource" data-index="${resources.indexOf(r)}">Open</button></article>`).join('');$('#resourceCount').textContent=`${list.length} resource${list.length===1?'':'s'} shown`;$('#resourceEmpty').hidden=list.length!==0;$$('.open-resource').forEach(btn=>btn.addEventListener('click',()=>openResource(resources[btn.dataset.index])))}
function openResource(r){$('#modalTitle').textContent=r.title;$('#modalText').textContent=`${r.subject} • ${r.type}\n\n${r.text}\n\nThis is a library placeholder. Add the real file/link later through the project files or admin system.`;$('#modalAction').textContent='Got it';$('#resourceModal').hidden=false}
$('#resourceSearch').addEventListener('input',renderResources);$('#typeFilter').addEventListener('change',renderResources);$('#clearResources').addEventListener('click',()=>{$('#resourceSearch').value='';$('#typeFilter').value='all';renderResources();showToast('Resource filters cleared')});
$$('.text-btn').forEach(btn=>btn.addEventListener('click',()=>{$('#resourceSearch').value=btn.dataset.subject;$('#typeFilter').value='all';renderResources();location.hash='resources';showToast(`${btn.dataset.subject} resources loaded`)}));
$('#randomBtn').addEventListener('click',()=>{const r=resources[Math.floor(Math.random()*resources.length)];$('#resourceSearch').value=r.subject;$('#typeFilter').value='all';renderResources();location.hash='resources';showToast(`Try: ${r.title}`)});
$('#closeModal').addEventListener('click',()=>$('#resourceModal').hidden=true);$('#modalAction').addEventListener('click',()=>$('#resourceModal').hidden=true);$('#resourceModal').addEventListener('click',e=>{if(e.target.id==='resourceModal')e.currentTarget.hidden=true});
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('hanshit-theme',document.body.classList.contains('dark')?'dark':'light')});if(localStorage.getItem('hanshit-theme')==='dark')document.body.classList.add('dark');
$('#menuBtn').addEventListener('click',()=>{$('#navMenu').classList.toggle('open')});$$('#navMenu a').forEach(a=>a.addEventListener('click',()=>$('#navMenu').classList.remove('open')));
$('#year').textContent=new Date().getFullYear();renderResources();
