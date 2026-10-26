const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const toast=$('#toast');
function showToast(message){
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200);
}

function readThemePreference(){try{return window.localStorage.getItem('hanshit-theme')}catch{return null}}
function saveThemePreference(theme){try{window.localStorage.setItem('hanshit-theme',theme)}catch{}}
function applyRootTheme(theme,persist=true){
  const dark=theme!=='light';
  document.body.classList.toggle('dark',dark);
  const btn=$('#themeBtn');
  if(btn){
    btn.textContent=dark?'☀':'☾';
    btn.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
    btn.setAttribute('aria-pressed',String(dark));
  }
  if(persist)saveThemePreference(dark?'dark':'light');
}
applyRootTheme(readThemePreference()==='light'?'light':'dark',false);

const themeBtn=$('#themeBtn');
if(themeBtn)themeBtn.addEventListener('click',()=>applyRootTheme(document.body.classList.contains('dark')?'light':'dark'));

const menuBtn=$('#menuBtn');
const navMenu=$('#navMenu');
function closeNav(){
  if(!navMenu||!menuBtn)return;
  navMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
}
if(menuBtn&&navMenu){
  menuBtn.addEventListener('click',()=>{
    const open=navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(open));
    if(open)navMenu.querySelector('a')?.focus();
  });
  navMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&navMenu.classList.contains('open')){closeNav();menuBtn.focus()}
  });
}

const projectModal=$('#projectModal');
const closeModalButton=$('#closeModal');
const modalAction=$('#modalAction');
function closeModal(){
  if(!projectModal)return;
  projectModal.hidden=true;
  document.body.classList.remove('modal-open');
}
if(closeModalButton)closeModalButton.addEventListener('click',closeModal);
if(modalAction)modalAction.addEventListener('click',closeModal);
if(projectModal){
  projectModal.addEventListener('click',e=>{if(e.target===projectModal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!projectModal.hidden)closeModal()});
}

const grid=$('#activityGrid');
if(grid){
  for(let i=0;i<364;i++){
    const cell=document.createElement('i');
    const wave=(i*17+i%11*7)%13;
    const level=wave>10?4:wave>7?3:wave>4?2:wave>2?1:0;
    cell.dataset.level=level;
    cell.setAttribute('aria-hidden','true');
    grid.appendChild(cell);
  }
}

const search=$('#librarySearch');
const cards=$$('.library-card');
function filterLibrary(){
  if(!search)return;
  const term=search.value.trim().toLowerCase();
  let visible=0;
  cards.forEach(card=>{
    const name=(card.dataset.name||card.textContent||'').toLowerCase();
    const ok=name.includes(term);
    card.hidden=!ok;
    if(ok)visible++;
  });
  const empty=$('#libraryEmpty');
  if(empty)empty.hidden=visible!==0;
}
if(search)search.addEventListener('input',filterLibrary);
cards.forEach(card=>card.addEventListener('click',()=>{
  const subject=card.dataset.subject||card.dataset.name;
  if(subject)window.location.href=`study-resource-manager/?subject=${encodeURIComponent(subject)}`;
}));

const year=$('#year');
if(year)year.textContent=new Date().getFullYear();

// The hero/build visual layer is already part of style.css.
// Keep behavior here only; avoid injecting a second stylesheet after page load.
const welcome=$('.welcome-card');
if(welcome){
  const hero=document.createElement('section');
  hero.className='hero-orbit reveal';
  hero.setAttribute('aria-label','Portfolio introduction');
  hero.innerHTML='<div class="orbit-grid" aria-hidden="true"></div><div class="hero-copy"><p class="eyebrow">BUILD / LEARN / IMPROVE</p><h2>Practical projects. Clean systems. Continuous learning.</h2><p>My portfolio is a living workspace for experiments, student projects and the skills I am building through practice.</p><span class="build-status"><i></i> Currently building</span></div><div class="orbit-core" aria-hidden="true"><span class="orbit-ring"></span><span class="orbit-ring two"></span></div>';
  welcome.insertAdjacentElement('afterend',hero);
  const build=document.createElement('section');
  build.className='build-strip reveal';
  build.setAttribute('aria-label','Build snapshot');
  build.innerHTML='<article class="build-card"><strong>Build</strong><small>Portfolio + practical web projects</small></article><article class="build-card"><strong>Learn</strong><small>C, JavaScript, Git & core CS</small></article><article class="build-card"><strong>Improve</strong><small>UI, performance, security & UX</small></article>';
  hero.insertAdjacentElement('afterend',build);
}

const revealItems=$$('.reveal');
if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),{threshold:.12});
  revealItems.forEach(el=>observer.observe(el));
}else revealItems.forEach(el=>el.classList.add('visible'));
