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
  who:`Hanshit is a Polytechnic Computer Science student and student developer. This repository works as his project portfolio and learning workspace. His documented approach is simple: Learn → Build → Improve → Repeat.`,
  projects:`There are three featured projects documented here:\n\n• Study Resource Manager — a browser-based study library\n• Student Productivity Dashboard — productivity, focus and progress tracking\n• C Student Record Management System — a C-based record manager\n\nIf you want, I can also explain any one of them in more detail.`,
  learning:`The documented learning areas include C Programming, JavaScript, Web Development, Git & GitHub, Computer Networks and core Computer Science fundamentals. The profile also mentions exploration of AI tools and prompt engineering.`,
  repo:`This repository is more than just a code dump. It is being used as a portfolio and learning workspace, with projects, resources, documentation, the Jems assistant and GitHub Pages deployment files.`,
  skills:`The documented skills include basic C, JavaScript and HTML/CSS learning, Git/GitHub workflow, Computer Networks, AI tools and prompt engineering, plus familiarity with Excel, Word, PowerPoint, Jira, Agile/Scrum, project planning and risk management.`,
  study:`The Study Resource Manager is a browser-based resource library for students. It includes search, subject/type filters, favorites, adding and deleting resources, theme switching, statistics and localStorage.`,
  productivity:`The Student Productivity Dashboard is designed around everyday study tracking. It includes tasks, a 25-minute focus timer, study-time tracking, subject progress, statistics, theme switching and localStorage.`,
  cproject:`The C Student Record Management System is a console-style C project. It uses structs, arrays, functions and validation, with operations for adding, listing, searching and deleting student records.`,
  web:`The documented web stack is HTML, CSS and JavaScript. GitHub Pages is used for the portfolio and browser-based project demos.`,
  github:`Git and GitHub are used for source control, documentation, project development and GitHub Pages deployment.`,
  comparison:`They each show a different side of the work:\n\n• Study Resource Manager → organization and browser UI\n• Student Productivity Dashboard → productivity and tracking\n• C Student Record Manager → C programming and data handling\n\nSo there isn't one “best” project—the strongest one depends on what you want to see.`,
  architecture:`Right now, Jems is a client-side repository knowledge assistant. Its interface is built with HTML, CSS and JavaScript, and its documented knowledge is stored in the local assistant logic. It can sound conversational, but it is not connected to a live LLM or private GitHub data.`,
  greetings:[`Hey! 👋 I'm Jems. What would you like to know about Hanshit or the repository?`,`Hi! 👋 Jems here. Ask me about the projects, skills, learning journey, or anything documented in this repo.`,`Hello! I'm Jems — Hanshit Sir Assistant. What are you curious about?`],
  help:`You can talk to me naturally. For example:\n\n• “Who is Hanshit?”\n• “Which project should I check first?”\n• “Explain the productivity dashboard.”\n• “What is he learning right now?”\n• “What technologies are used?”\n• “Compare the three projects.”\n• “How does Jems work?”\n\nI can also tell you when something isn't documented instead of making it up.`,
  unknown:`I don't have enough documented information to answer that confidently. I’d rather be honest than make something up.\n\nTry asking me about Hanshit, his projects, skills, technologies, learning areas, GitHub work, or Jems.`
};

function add(text,type,save=true){
  const el=document.createElement('div');
  el.className=`msg ${type}`;
  el.textContent=text;
  messages.appendChild(el);
  messages.scrollTop=messages.scrollHeight;
  if(save)history.push({type,text,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});
}

function normalize(q){
  return q.toLowerCase().replace(/[^a-z0-9\s?&/-]/g,' ').replace(/\s+/g,' ').trim();
}

function recentContext(){
  const users=history.filter(m=>m.type==='user');
  return users.length?users[users.length-1].text.toLowerCase():'';
}

function answer(q){
  const s=normalize(q);
  const previous=recentContext();

  if(!s)return `I'm listening. What would you like to know?`;
  if(/^(hi|hello|hey|hii|yo|good morning|good evening)\b/.test(s))return facts.greetings[Math.floor(Math.random()*facts.greetings.length)];
  if(/^(thanks|thank you|thx|great|nice|okay|ok)\b/.test(s))return `You're welcome! 😊 If you want, we can keep exploring the repository.`;
  if(s.includes('who are you')||s.includes('what are you'))return `I'm Jems — Hanshit Sir Assistant. I help visitors understand the documented profile, projects, skills and repository. Think of me as the conversational guide for this portfolio.`;
  if(s.includes('who is hanshit')||s.includes('about hanshit')||s.includes('tell me about hanshit'))return facts.who;
  if(s.includes('study resource')||s.includes('resource manager'))return facts.study;
  if(s.includes('productivity')||s.includes('focus timer')||s.includes('study dashboard'))return facts.productivity;
  if(s.includes('student record')||s.includes('c project')||s.includes('c programming project'))return facts.cproject;
  if(s.includes('compare')||s.includes('difference between')||s.includes('which project')||s.includes('best project'))return facts.comparison;
  if(s.includes('project'))return facts.projects;
  if(s.includes('learn')||s.includes('currently learning')||s.includes('what is he learning'))return facts.learning;
  if(s.includes('skill')||s.includes('technology')||s.includes('tech stack')||s.includes('tools'))return facts.skills;
  if(s.includes('web development')||s.includes('html')||s.includes('javascript')||s.includes('css'))return facts.web;
  if(s.includes('github')||s.includes('git workflow'))return facts.github;
  if(s.includes('repository')||s.includes('repo'))return facts.repo;
  if(s.includes('how does jems work')||s.includes('what is jems')||s.includes('who is jems')||s.includes('architecture'))return facts.architecture;
  if(s.includes('help')||s.includes('what can you do')||s.includes('what should i ask'))return facts.help;
  if((s==='more'||s.includes('tell me more')||s.includes('explain more'))&&previous.includes('project'))return facts.projects;
  return facts.unknown;
}

function persist(){localStorage.setItem('jems-history',JSON.stringify(history.slice(-60)));}

function restore(){
  try{
    const saved=JSON.parse(localStorage.getItem('jems-history')||'[]');
    saved.forEach(m=>{history.push(m);add(m.text,m.type,false)});
  }catch(e){localStorage.removeItem('jems-history');}
  if(!history.length)add(`Hi! I'm Jems — Hanshit Sir Assistant. 👋\n\nAsk me anything about Hanshit, his projects, skills, learning journey or this repository.`,`bot`);
}

function send(q){
  q=q.trim();
  if(!q)return;
  add(q,'user');
  persist();
  input.value='';
  input.focus();
  typing.classList.add('show');
  const delay=Math.min(900,350+q.length*8);
  setTimeout(()=>{
    typing.classList.remove('show');
    add(answer(q),'bot');
    persist();
  },delay);
}

form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.q)));
clearBtn.addEventListener('click',()=>{
  localStorage.removeItem('jems-history');
  history.length=0;
  messages.innerHTML='';
  add(`All clear. 👋 Fresh conversation from here. What would you like to explore?`,'bot');
  persist();
});
themeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('light');
  localStorage.setItem('jems-theme',document.body.classList.contains('light')?'light':'dark');
});
if(localStorage.getItem('jems-theme')==='light')document.body.classList.add('light');
exportBtn.addEventListener('click',()=>{
  const text=history.map(m=>`${m.type==='user'?'You':'Jems'} [${m.time||''}]: ${m.text}`).join('\n\n');
  const blob=new Blob([text],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='jems-chat.txt';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
});
copyBtn.addEventListener('click',async()=>{
  const bots=history.filter(m=>m.type==='bot');
  const last=bots[bots.length-1];
  if(!last)return;
  try{
    await navigator.clipboard.writeText(last.text);
    copyBtn.textContent='Copied ✓';
    setTimeout(()=>copyBtn.textContent='Copy last answer',1200);
  }catch(e){copyBtn.textContent='Copy unavailable';setTimeout(()=>copyBtn.textContent='Copy last answer',1200);}
});
restore();
