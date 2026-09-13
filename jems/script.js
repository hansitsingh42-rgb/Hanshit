const messages=document.getElementById('messages');
const form=document.getElementById('chatForm');
const input=document.getElementById('input');
const typing=document.getElementById('typing');
const clearBtn=document.getElementById('clearBtn');
const themeBtn=document.getElementById('themeBtn');
const exportBtn=document.getElementById('exportBtn');
const copyBtn=document.getElementById('copyBtn');
const jsonBtn=document.getElementById('jsonBtn');
const regenerateBtn=document.getElementById('regenerateBtn');
const searchInput=document.getElementById('searchInput');
const charCount=document.getElementById('charCount');
const stats=document.getElementById('stats');
const sendBtn=document.getElementById('sendBtn');
const shortcutBtn=document.getElementById('shortcutBtn');
const shortcutsDialog=document.getElementById('shortcutsDialog');
const closeDialog=document.getElementById('closeDialog');
const history=[];
const MAX_INPUT=1000;
const MAX_HISTORY=60;
const STORAGE_KEY='jems-history';
const THEME_KEY='jems-theme';

const facts={
who:`Hanshit is a Polytechnic Computer Science student and student developer. This repository is his project portfolio and learning workspace. His documented approach is: Learn → Build → Improve → Repeat.`,
projects:`Haan, bilkul. Repository mein 5 main projects/experiences documented hain:\n\n1. Study Resource Manager — students ke liye browser-based study resource library.\n2. Student Productivity Dashboard — tasks, focus timer, study time aur progress tracking.\n3. C Student Record Management System — C mein bana console-style record manager.\n4. Advanced Weather Dashboard (SKH Cast+) — live weather, location search, forecasts, favorites aur smart insights.\n5. Jems AI — documented profile aur project information ke liye conversational assistant.\n\nAgar chaho, main kisi ek ko simple language mein detail mein samjha sakta hoon.`,
learning:`Abhi documented learning areas mein C Programming, JavaScript, Web Development, Git & GitHub, Computer Networks aur core Computer Science fundamentals shamil hain. Profile mein AI tools aur prompt engineering ki exploration bhi documented hai.`,
repo:`Ye repository sirf code store karne ke liye nahi hai. Ye portfolio + learning workspace hai, jisme projects, resources, documentation, Jems assistant aur deployment files hain.`,
skills:`Documented skills mein basic C, JavaScript, HTML/CSS learning, Git/GitHub workflow, Computer Networks, AI tools aur prompt engineering shamil hain. Saath hi Excel, Word, PowerPoint, Jira, Agile/Scrum, project planning aur risk management ki familiarity bhi documented hai.`,
study:`Study Resource Manager ek browser-based study library hai. Isme search, subject/type filters, favorites, resources add/delete karna, theme switching, statistics aur localStorage support hai.`,
productivity:`Student Productivity Dashboard daily study tracking ke liye bana hai. Isme tasks, 25-minute focus timer, study-time tracking, subject progress, statistics, theme switching aur localStorage hai.`,
cproject:`C Student Record Management System ek console-style C project hai. Isme structs, arrays, functions aur validation use hote hain, aur student records add, list, search aur delete kiye ja sakte hain.`,
skycast:`SKH Cast+ ek API-integrated weather dashboard hai. Isme city search, geolocation, current weather, hourly forecast, 7-day forecast, favorites, °C/°F conversion, theme switching aur smart insights hain.`,
web:`Documented web stack HTML, CSS aur JavaScript hai. Static portfolio/project deployments GitHub Pages aur other documented hosting environments par use kiye gaye hain.`,
github:`Git aur GitHub ka use source control, documentation, project development aur deployment workflows ke liye kiya ja raha hai.`,
comparison:`Agar simple comparison karein:\n\n• Study Resource Manager → organization + browser UI\n• Student Productivity Dashboard → productivity + tracking\n• C Student Record Manager → C programming + data handling\n• SKH Cast+ → APIs + weather dashboard + frontend engineering\n• Jems AI → conversational UI + client-side knowledge logic\n\nIsliye ek fixed “best” project nahi hai. Aap kis skill ko dekhna chahte ho, uske hisaab se best project change hota hai.`,
architecture:`Jems ka current version client-side repository knowledge assistant hai. Interface HTML, CSS aur JavaScript se bana hai aur documented knowledge assistant logic mein stored hai. Ye conversational ho sakta hai, lekin abhi live LLM ya private GitHub data se directly connected nahi hai.`,
greetings:[`Hey! 👋 Main Jems hoon. Main badhiya hoon 😄 Tum batao, Hanshit ke baare mein kya jaana hai?`,`Hi! 👋 Jems here. Kya scene hai? Hanshit ke projects, skills ya GitHub ke baare mein kuch poochna hai?`,`Hello! 👋 Main Jems — Hanshit Sir Assistant. Bolo, kya explore karna hai?`,`Hey! 😄 Main ready hoon. Hanshit ne kya banaya, kya seekh raha hai, ya koi project detail chahiye?`],
thanks:[`You're welcome! 😊`,`Anytime! 😄 Aur kuch poochna ho to bolo.`,`Bilkul! 👍 Chalo, aur explore karte hain.`],
help:`Tum mujhse bilkul normal conversation ki tarah baat kar sakte ho. Jaise:\n\n• “Hanshit ne abhi tak kya-kya banaya hai?”\n• “Inmein se best project kaunsa hai?”\n• “Study Resource Manager kya karta hai?”\n• “Wo abhi kya seekh raha hai?”\n• “Kaunsi technologies use karta hai?”\n• “Projects compare karo.”\n• “Jems actually kaise kaam karta hai?”\n\nAgar koi information repository mein documented nahi hai, main guess karke answer nahi banaunga.`,
unknown:`Hmm, is question ka reliable answer mujhe repository ke documented data mein nahi mil raha. Main guess karke galat information dena prefer nahi karunga. 🙂\n\nTum Hanshit, uske projects, skills, technologies, learning, GitHub work ya Jems ke baare mein pooch sakte ho.`
};

function safeString(value,max=MAX_INPUT){return typeof value==='string'?value.slice(0,max):''}
function now(){return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
function updateStats(){const users=history.filter(m=>m.type==='user').length;stats.textContent=`${history.length} messages · ${users} questions`}
function updateCount(){charCount.textContent=`${input.value.length}/${MAX_INPUT}`}
function makeActions(type,text){
 const row=document.createElement('div');row.className='msg-actions';
 if(type==='bot'){
  const copy=document.createElement('button');copy.type='button';copy.textContent='Copy';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(safeString(text));copy.textContent='Copied ✓';setTimeout(()=>copy.textContent='Copy',1000)}catch(e){copy.textContent='Unavailable'}});row.appendChild(copy);
 }
 return row;
}
function add(text,type,save=true){
 text=safeString(text);if(type!=='user'&&type!=='bot')return;
 const wrap=document.createElement('div');wrap.className=`msg-wrap ${type}-wrap`;
 const el=document.createElement('div');el.className=`msg ${type}`;el.textContent=text;wrap.appendChild(el);
 const meta=document.createElement('div');meta.className='msg-meta';meta.textContent=now();wrap.appendChild(meta);
 const actions=makeActions(type,text);if(actions.childNodes.length)wrap.appendChild(actions);
 messages.appendChild(wrap);messages.scrollTop=messages.scrollHeight;
 if(save)history.push({type,text,time:now()});updateStats();
}
function normalize(q){return safeString(q).toLowerCase().replace(/[^a-z0-9\s?&/-]/g,' ').replace(/\s+/g,' ').trim()}
function recentUsers(count=4){return history.filter(m=>m.type==='user').slice(-count).map(m=>m.text.toLowerCase()).join(' | ')}
function lastTopic(){const text=recentUsers(3);if(text.includes('study resource')||text.includes('resource manager'))return'study';if(text.includes('productivity')||text.includes('focus timer')||text.includes('dashboard'))return'productivity';if(text.includes('student record')||text.includes('c project'))return'cproject';if(text.includes('weather')||text.includes('skycast')||text.includes('skh cast'))return'skycast';if(text.includes('project')||text.includes('banaya')||text.includes('built'))return'projects';return''}
function answer(q){
 const s=normalize(q),context=recentUsers(),topic=lastTopic();if(!s)return`I'm listening. Bolo, kya jaana hai?`;
 if(/^(hi|hello|hey|hii|yo|good morning|good evening)\b/.test(s))return facts.greetings[Math.floor(Math.random()*facts.greetings.length)];
 if(/^(thanks|thank you|thx|great|nice|okay|ok|cool)\b/.test(s))return facts.thanks[Math.floor(Math.random()*facts.thanks.length)];
 if(s.includes('who are you')||s.includes('what are you'))return`Main Jems hoon — Hanshit Sir Assistant. 👋 Main visitors ko Hanshit ke documented profile, projects, skills aur repository ko samajhne mein help karta hoon. Simple words mein, main is portfolio ka conversational guide hoon.`;
 if(s.includes('who is hanshit')||s.includes('about hanshit')||s.includes('tell me about hanshit')||s.includes('hanshit kaun'))return facts.who;
 if(s.includes('abhi tak')||s.includes('so far')||s.includes('has built')||s.includes('built')||s.includes('banaya')||s.includes('banaye')||s.includes('what did hanshit make'))return facts.projects;
 if(s.includes('study resource')||s.includes('resource manager'))return facts.study;
 if(s.includes('productivity')||s.includes('focus timer')||s.includes('study dashboard'))return facts.productivity;
 if(s.includes('student record')||s.includes('c project')||s.includes('c programming project'))return facts.cproject;
 if(s.includes('weather')||s.includes('skycast')||s.includes('skh cast'))return facts.skycast;
 if((s.includes('ye')||s.includes('this')||s.includes('that')||s.includes('it')||s.includes('iske')||s.includes('iska'))&&(s.includes('kya')||s.includes('kaise')||s.includes('explain')||s.includes('detail')||s.includes('more'))){if(topic==='study')return facts.study;if(topic==='productivity')return facts.productivity;if(topic==='cproject')return facts.cproject;if(topic==='skycast')return facts.skycast;if(topic==='projects')return facts.projects}
 if(s.includes('compare')||s.includes('difference between')||s.includes('which project')||s.includes('best project')||s.includes('kaunsa project')||s.includes('kaun sa project'))return facts.comparison;
 if(s.includes('project'))return facts.projects;
 if(s.includes('learn')||s.includes('currently learning')||s.includes('what is he learning')||s.includes('kya seekh'))return facts.learning;
 if(s.includes('skill')||s.includes('technology')||s.includes('tech stack')||s.includes('tools')||s.includes('technologies'))return facts.skills;
 if(s.includes('web development')||s.includes('html')||s.includes('javascript')||s.includes('css'))return facts.web;
 if(s.includes('github')||s.includes('git workflow'))return facts.github;
 if(s.includes('repository')||s.includes('repo'))return facts.repo;
 if(s.includes('how does jems work')||s.includes('what is jems')||s.includes('who is jems')||s.includes('architecture')||s.includes('jems kaise'))return facts.architecture;
 if(s.includes('help')||s.includes('what can you do')||s.includes('what should i ask'))return facts.help;
 if(s.includes('more')||s.includes('aur batao')||s.includes('aur bata')||s.includes('detail')||s.includes('explain more')||s.includes('phir')||s.includes('why')){if(topic==='study')return`Haan, Study Resource Manager mein main focus student resources ko easily organize aur find karna hai. Search aur filters se resources dhoondhe ja sakte hain, favorites save kiye ja sakte hain aur browser mein data localStorage ke through persist hota hai.`;if(topic==='productivity')return`Haan. Productivity Dashboard ka idea daily study workflow ko ek jagah track karna hai — tasks complete karna, focus timer chalana, study time dekhna aur subject progress monitor karna.`;if(topic==='cproject')return`Is project mein C ke core concepts practical way mein use kiye gaye hain — structs, arrays, functions aur validation. User student records ko add, list, search aur delete kar sakta hai.`;if(topic==='skycast')return facts.skycast;if(topic==='projects')return facts.projects;if(context.includes('hanshit'))return facts.who}
 return facts.unknown;
}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(history.slice(-MAX_HISTORY).map(m=>({type:m.type,text:safeString(m.text),time:safeString(m.time,20)}))))}catch(e){}}
function restore(){try{const raw=localStorage.getItem(STORAGE_KEY),saved=raw?JSON.parse(raw):[];if(Array.isArray(saved))saved.slice(-MAX_HISTORY).forEach(m=>{if(m&&(m.type==='user'||m.type==='bot')&&typeof m.text==='string'&&m.text.length<=MAX_INPUT){history.push({type:m.type,text:m.text,time:safeString(m.time,20)});add(m.text,m.type,false)}})}catch(e){try{localStorage.removeItem(STORAGE_KEY)}catch(_e){}}if(!history.length)add(`Hi! I'm Jems — Hanshit Sir Assistant. 👋\n\nMain Hanshit ke projects, skills, learning journey aur repository ke baare mein bata sakta hoon. Bolo, kya jaana hai?`,'bot')}
function setBusy(value){busy=value;typing.classList.toggle('show',value);sendBtn.disabled=value}
let busy=false;
function send(q){if(busy)return;q=safeString(q).trim();if(!q)return;add(q,'user');persist();input.value='';updateCount();input.focus();setBusy(true);const delay=Math.min(1000,350+q.length*8);setTimeout(()=>{add(answer(q),'bot');persist();setBusy(false)},delay)}
function exportChat(asJson=false){const data=history.slice(-MAX_HISTORY);const text=asJson?JSON.stringify(data,null,2):data.map(m=>`${m.type==='user'?'You':'Jems'} [${safeString(m.time,20)}]: ${safeString(m.text)}`).join('\n\n');const blob=new Blob([text],{type:asJson?'application/json;charset=utf-8':'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=asJson?'jems-chat.json':'jems-chat.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
function filterMessages(){const term=normalize(searchInput.value);document.querySelectorAll('.msg-wrap').forEach(w=>{const match=!term||normalize(w.textContent).includes(term);w.hidden=!match;w.classList.toggle('highlight',!!term&&match)})}
form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});
input.addEventListener('input',()=>{updateCount();input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px'});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input.value)}});
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.q)));
clearBtn.addEventListener('click',()=>{if(!history.length)return;if(!confirm('Clear the Jems conversation from this browser?'))return;try{localStorage.removeItem(STORAGE_KEY)}catch(e){}history.length=0;messages.replaceChildren();add(`All clear. 👋 Fresh conversation from here. Bolo, kya explore karna hai?`,'bot');persist()});
themeBtn.addEventListener('click',()=>{document.body.classList.toggle('light');try{localStorage.setItem(THEME_KEY,document.body.classList.contains('light')?'light':'dark')}catch(e){}});
try{if(localStorage.getItem(THEME_KEY)==='light')document.body.classList.add('light')}catch(e){}
exportBtn.addEventListener('click',()=>exportChat(false));jsonBtn.addEventListener('click',()=>exportChat(true));
copyBtn.addEventListener('click',async()=>{const bots=history.filter(m=>m.type==='bot'),last=bots[bots.length-1];if(!last)return;try{await navigator.clipboard.writeText(safeString(last.text));copyBtn.textContent='Copied ✓';setTimeout(()=>copyBtn.textContent='Copy last answer',1200)}catch(e){copyBtn.textContent='Copy unavailable';setTimeout(()=>copyBtn.textContent='Copy last answer',1200)}});
regenerateBtn.addEventListener('click',()=>{const users=history.filter(m=>m.type==='user');const last=users[users.length-1];if(last&&!busy){setBusy(true);setTimeout(()=>{add(answer(last.text),'bot');persist();setBusy(false)},450)}});
searchInput.addEventListener('input',filterMessages);
shortcutBtn.addEventListener('click',()=>{if(typeof shortcutsDialog.showModal==='function')shortcutsDialog.showModal()});
closeDialog.addEventListener('click',()=>shortcutsDialog.close());
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement!==input&&document.activeElement!==searchInput){e.preventDefault();input.focus()}if(e.key==='Escape'&&searchInput.value){searchInput.value='';filterMessages()}});
restore();updateCount();updateStats();
