const messages=document.getElementById('messages');
const form=document.getElementById('chatForm');
const input=document.getElementById('input');

const facts={
  who:`Hanshit is a Polytechnic Computer Science student and student developer. This repository is his project portfolio and learning workspace. His documented approach is: Learn → Build → Improve → Repeat.`,
  projects:`The repository documents three featured projects: Study Resource Manager, Student Productivity Dashboard, and C Student Record Management System. The first two are browser-based projects, while the C project is a console application with a browser live-demo version.`,
  learning:`Hanshit is currently learning C Programming, JavaScript, Web Development, Git & GitHub, Computer Networks, and core Computer Science fundamentals. The profile also documents exploration of AI tools and prompt engineering.`,
  repo:`Hanshit is a portfolio and learning workspace containing project code, learning resources, documentation, the Jems assistant, and GitHub Pages deployment configuration.`,
  skills:`Documented skills include basic C, JavaScript and HTML/CSS learning, Git/GitHub workflow, Computer Networks learning, AI tools and prompt engineering exploration, plus familiarity with Excel, Word, PowerPoint, Jira, Agile/Scrum, project planning, and risk management.`,
  study:`The Study Resource Manager is a browser-based resource library with search, subject/type filters, favorites, add/delete resources, theme switching, statistics, and localStorage.`,
  productivity:`The Student Productivity Dashboard helps manage tasks, track study time, use a 25-minute focus timer, monitor subject progress, and save data with localStorage.`,
  cproject:`The C Student Record Management System manages student records using C, structs, arrays, functions, validation, and add/list/search/delete operations.`,
  jems:`Jems is the visitor-facing Hanshit Sir Assistant. The current version is a client-side repository knowledge assistant: it answers from documented project/profile information and does not invent missing facts.`,
  contact:`For information available through this repository, ask me about Hanshit, projects, skills, technologies, learning, or the repository structure.`,
  help:`You can ask me things like: “Who is Hanshit?”, “What projects has he built?”, “What is he learning?”, “Tell me about the Study Resource Manager”, “What technologies does he use?”, or “What is Jems?”`
};

function add(text,type){
  const el=document.createElement('div');
  el.className=`msg ${type}`;
  el.textContent=text;
  messages.appendChild(el);
  messages.scrollTop=messages.scrollHeight;
}

function answer(q){
  const s=q.toLowerCase().replace(/[^a-z0-9\s?&/-]/g,' ');
  if(/^(hi|hello|hey|hii|good morning|good evening)/.test(s)) return `Hi! 👋 I'm Jems. I can help you explore Hanshit's documented profile, projects, skills, learning journey, and repository.`;
  if(s.includes('who is hanshit')||s.includes('about hanshit')||s.includes('tell me about hanshit')) return facts.who;
  if(s.includes('study resource')||s.includes('resource manager')) return facts.study;
  if(s.includes('productivity')||s.includes('focus timer')) return facts.productivity;
  if(s.includes('student record')||s.includes('c project')||s.includes('c programming project')) return facts.cproject;
  if(s.includes('project')) return facts.projects;
  if(s.includes('learn')||s.includes('currently learning')) return facts.learning;
  if(s.includes('skill')||s.includes('technology')||s.includes('tech stack')||s.includes('tools')) return facts.skills;
  if(s.includes('repository')||s.includes('repo')||s.includes('github')) return facts.repo;
  if(s.includes('what is jems')||s.includes('who is jems')||s.includes('about jems')) return facts.jems;
  if(s.includes('help')||s.includes('what can you do')) return facts.help;
  if(s.includes('contact')||s.includes('reach')) return facts.contact;
  return `I don't have a documented answer for that yet. I can help with Hanshit's profile, projects, skills, technologies, learning areas, repository, or Jems. Try asking “What projects has Hanshit built?”`;
}

add(`Hi! I'm Jems — Hanshit Sir Assistant. 👋 Ask me about Hanshit, his projects, skills, learning journey, technologies, or this repository.`,`bot`);

function send(q){
  q=q.trim();
  if(!q)return;
  add(q,'user');
  input.value='';
  input.focus();
  setTimeout(()=>add(answer(q),'bot'),220);
}

form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.q)));
