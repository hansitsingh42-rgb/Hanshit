const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('hanshit-theme',document.body.classList.contains('dark')?'dark':'light')});
if(localStorage.getItem('hanshit-theme')==='light')document.body.classList.remove('dark');
$('#menuBtn').addEventListener('click',()=>$('#navMenu').classList.toggle('open'));
$$('#navMenu a').forEach(a=>a.addEventListener('click',()=>$('#navMenu').classList.remove('open')));
function closeModal(){$('#projectModal').hidden=true;document.body.classList.remove('modal-open')}
$('#closeModal').addEventListener('click',closeModal);$('#modalAction').addEventListener('click',closeModal);$('#projectModal').addEventListener('click',e=>{if(e.target.id==='projectModal')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#projectModal').hidden)closeModal()});
const grid=$('#activityGrid');for(let i=0;i<364;i++){const cell=document.createElement('i');const wave=(i*17+i%11*7)%13;const level=wave>10?4:wave>7?3:wave>4?2:wave>2?1:0;cell.dataset.level=level;grid.appendChild(cell)}
const search=$('#librarySearch');const cards=$$('.library-card');function filterLibrary(){const term=search.value.trim().toLowerCase();let visible=0;cards.forEach(card=>{const ok=card.dataset.name.toLowerCase().includes(term);card.hidden=!ok;if(ok)visible++});$('#libraryEmpty').hidden=visible!==0}search.addEventListener('input',filterLibrary);cards.forEach(card=>card.addEventListener('click',()=>showToast(`${card.dataset.name} selected`)));
$('#year').textContent=new Date().getFullYear();

// Premium visual layer: lightweight 3D-inspired hero + build snapshot.
const premium=document.createElement('link');premium.rel='stylesheet';premium.href='assets/premium.css';document.head.appendChild(premium);
const welcome=$('.welcome-card');
if(welcome){
  const hero=document.createElement('section');hero.className='hero-orbit reveal';hero.setAttribute('aria-label','Portfolio introduction');hero.innerHTML='<div class="orbit-grid" aria-hidden="true"></div><div class="hero-copy"><p class="eyebrow">BUILD / LEARN / IMPROVE</p><h2>Practical projects. Clean systems. Continuous learning.</h2><p>My portfolio is a living workspace for experiments, student projects and the skills I am building through practice.</p><span class="build-status"><i></i> Currently building</span></div><div class="orbit-core" aria-hidden="true"><span class="orbit-ring"></span><span class="orbit-ring two"></span></div>';
  welcome.insertAdjacentElement('afterend',hero);
  const build=document.createElement('section');build.className='build-strip reveal';build.setAttribute('aria-label','Build snapshot');build.innerHTML='<article class="build-card"><strong>Build</strong><small>Portfolio + practical web projects</small></article><article class="build-card"><strong>Learn</strong><small>C, JavaScript, Git & core CS</small></article><article class="build-card"><strong>Improve</strong><small>UI, performance, security & UX</small></article>';
  hero.insertAdjacentElement('afterend',build);
}
const revealItems=$$('.reveal');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});revealItems.forEach(el=>observer.observe(el))}else revealItems.forEach(el=>el.classList.add('visible'));

// Small pointer interaction for the 3D-inspired hero; disabled for touch/reduced-motion.
const orbit=document.querySelector('.hero-orbit');if(orbit&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!('ontouchstart'in window)){orbit.addEventListener('pointermove',e=>{const r=orbit.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;orbit.querySelector('.orbit-core').style.transform=`translate(${x*18}px,calc(-50% + ${y*10}px))`});orbit.addEventListener('pointerleave',()=>{orbit.querySelector('.orbit-core').style.transform='translateY(-50%)'})}
