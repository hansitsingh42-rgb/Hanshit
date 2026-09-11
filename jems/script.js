const messages=document.getElementById('messages');
const form=document.getElementById('chatForm');
const input=document.getElementById('input');
const typing=document.getElementById('typing');
const clearBtn=document.getElementById('clearBtn');
const themeBtn=document.getElementById('themeBtn');
const exportBtn=document.getElementById('exportBtn');
const copyBtn=document.getElementById('copyBtn');
const history=[];

const facts={
who:`Hanshit is a Polytechnic Computer Science student and student developer. This repository is his project portfolio and learning workspace. His documented approach is: Learn → Build → Improve → Repeat.`,
projects:`The repository documents three featured projects:\n\n• Study Resource Manager — browser-based study library\n• Student Productivity Dashboard — tasks, focus timer and progress\n• C Student Record Management System — C-based student record manager\n\nThe first two have browser interfaces; the C project also has a browser live-demo version.`,
learning:`Current documented learning areas include C Programming, JavaScript, Web Development, Git & GitHub, Computer Networks, and core Computer Science fundamentals. The profile also documents exploration of AI tools and prompt engineering.`,
repo:`Hanshit is a portfolio and learning workspace containing project code, learning resources, documentation, the Jems assistant, and GitHub Pages deployment configuration.`,
skills:`Documented skills include basic C, JavaScript and HTML/CSS learning, Git/GitHub workflow, Computer Networks learning, AI tools and prompt engineering exploration, plus familiarity with Excel, Word, PowerPoint, Jira, Agile/Scrum, project planning, and risk management.`,
study:`Study Resource Manager is a browser-based student resource library. Documented features include search, subject/type filters, favorites, adding/deleting resources, theme switching, statistics and localStorage.`,
productivity:`Student Productivity Dashboard is a responsive productivity tool for tasks, a 25-minute focus timer, study-time tracking, subject progress, statistics, theme switching and localStorage.`,
cproject:`C Student Record Management System is a console-style C project using structs, arrays, functions and validation. It supports adding, listing, searching and deleting student records.`,
web:`The documented web stack includes HTML, CSS and JavaScript. GitHub Pages is used for the portfolio and browser project demos.`,
github:`The repository uses Git and GitHub workflow for source control, documentation, project development and GitHub Pages deployment.`,
comparison:`For a quick portfolio comparison:\n\nStudy Resource Manager → resource organization\nStudent Productivity Dashboard → productivity and tracking\nC Student Record Manager → C programming and data handling`,
architecture:`Jems currently runs as a client-side repository knowledge assistant. The interface is HTML/CSS/JavaScript, while its documented knowledge is encoded in the assistant's local knowledge base. It does not expose private credentials or pretend that undocumented information is known.`,

greetings:`Hi! 👋 I'm Jems — Hanshit Sir Assistant. I can help you explore Hanshit's documented profile, projects, skills, technologies, learning journey and repository.`,
help:`Try questions such as:\n• Who is Hanshit?\n• What projects has Hanshit built?\n• Explain the Study Resource Manager\n• What is Hanshit learning?\n• What technologies does he use?\n• Compare his projects\n• How does Jems work?\n• Tell me about the repository`,
unknown:`I don't have a documented answer for that yet. I won't invent information. I can currently answer questions about Hanshit, projects, skills, technologies, learning areas, repository structure and Jems.`
};

function add(text,type,save=true){
  const el=document.createElement('div');
  el.className=`msg ${type}`;
  el.textContent=text;
  messages.appendChild(el);
  messages.scrollTop=messages.scrollHeight;
  if(save) history.push({type,text,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});
}

function answer(q){
  const s=q.toLowerCase().replace(/[^a-z0-9\s?&/-]/g,' ');
  if(/^(hi|hello|hey|hii|good morning|good evening)\b/.test(s))return facts.greetings;
  if(s.includes('who is hanshit')||s.includes('about hanshit')||s.includes('tell me about hanshit'))return facts.who;
  if(s.includes('study resource')||s.includes('resource manager'))return facts.study;
  if(s.includes('productivity')||s.includes('focus timer'))return facts.productivity;
  if(s.includes('student record')||s.includes('c project')||s.includes('c programming project'))return facts.cproject;
  if(s.includes('compare')||s.includes('difference between')||s.includes('which project'))return facts.comparison;
  if(s.includes('project'))return facts.projects;
  if(s.includes('learn')||s.includes('currently learning')||s.includes('study'))return facts.learning;
  if(s.includes('skill')||s.includes('technology')||s.includes('tech stack')||s.includes('tools'))return facts.skills;
  if(s.includes('web development')||s.includes('html')||s.includes('javascript')||s.includes('css'))return facts.web;
  if(s.includes('github')||s.includes('git workflow'))return facts.github;
  if(s.includes('repository')||s.includes('repo'))return facts.repo;
  if(s.includes('how does jems work')||s.includes('what is jems')||s.includes('who is jems')||s.includes('architecture'))return facts.architecture;
  if(s.includes('help')||s.includes('what can you do'))return facts.help;
  return facts.unknown;
}

function persist(){localStorage.setItem('jems-history',JSON.stringify(history.slice(-60)));}
function restore(){
  try{const saved=JSON.parse(localStorage.getItem('jems-history')||'[]');saved.forEach(m=>{history.push(m);add(m.text,m.type,false)});}catch(e){}
  if(!history.length)add(`Hi! I'm Jems — Hanshit Sir Assistant. 👋 Ask me about Hanshit, his projects, skills, learning journey, technologies, or this repository.`,'bot');
}

function send(q){
  q=q.trim();
  if(!q)return;
  add(q,'user');
  persist();
  input.value='';
  input.focus();
  typing.classList.add('show');
  setTimeout(()=>{typing.classList.remove('show');add(answer(q),'bot');persist()},350);
}

form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.q)));
clearBtn.addEventListener('click',()=>{localStorage.removeItem('jems-history');history.length=0;messages.innerHTML='';add(`Chat cleared. 👋 I'm ready for a new conversation.`,'bot');persist()});
themeBtn.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('jems-theme',document.body.classList.contains('light')?'light':'dark')});
if(localStorage.getItem('jems-theme')==='light')document.body.classList.add('light');
exportBtn.addEventListener('click',()=>{const text=history.map(m=>`${m.type==='user'?'You':'Jems'}: ${m.text}`).join('\n\n');const blob=new Blob([text],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='jems-chat.txt';a.click();URL.revokeObjectURL(a.href)});
copyBtn.addEventListener('click',async()=>{const bots=history.filter(m=>m.type==='bot');const last=bots[bots.length-1];if(last){try{await navigator.clipboard.writeText(last.text);copyBtn.textContent='Copied ✓';setTimeout(()=>copyBtn.textContent='Copy last answer',1200)}catch(e){}}});
restore();
