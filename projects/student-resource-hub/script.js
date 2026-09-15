const resources=[
  {title:"Computer Networks",subject:"Computer",chapter:"PAN, LAN, MAN & WAN",type:"Notes",description:"Network types explained with simple examples and comparisons."},
  {title:"Functions & Arrays",subject:"Computer",chapter:"C Programming",type:"Notes",description:"A practical starting point for writing and understanding basic C programs."},
  {title:"Laws of Force",subject:"Mechanics",chapter:"Force Systems",type:"Notes",description:"Core ideas, notation and the main laws used in first-year mechanics."},
  {title:"Barriers to Communication",subject:"English",chapter:"Communication Skills",type:"Notes",description:"Short notes for revision, with everyday examples to make the topic clear."},
  {title:"Introduction to AI",subject:"AI",chapter:"AI Fundamentals",type:"Study Guide",description:"Basic AI terminology and concepts before moving to advanced topics."},
  {title:"Chemistry Fundamentals",subject:"Chemistry",chapter:"Engineering Chemistry",type:"Study Guide",description:"Organized first-year material for quick study and revision."}
];

const grid=document.querySelector('#resource-grid');
const filters=document.querySelector('#filters');
const search=document.querySelector('#resource-search');
const clearSearch=document.querySelector('#clear-search');
const count=document.querySelector('#count');
const empty=document.querySelector('#empty-state');
const resetFilters=document.querySelector('#reset-filters');
const modal=document.querySelector('#resource-modal');
const modalTitle=document.querySelector('#modal-title');
const modalSubject=document.querySelector('#modal-subject');
const modalChapter=document.querySelector('#modal-chapter');
const modalDescription=document.querySelector('#modal-description');
const modalCloseButton=document.querySelector('#modal-close-button');
let selected='All';

const subjects=['All',...new Set(resources.map(item=>item.subject))];
subjects.forEach(subject=>{
  const button=document.createElement('button');
  button.type='button';
  button.className=`filter${subject===selected?' active':''}`;
  button.textContent=subject;
  button.setAttribute('aria-pressed',String(subject===selected));
  button.addEventListener('click',()=>{selected=subject;render();});
  filters.appendChild(button);
});

function openResource(item){
  modalTitle.textContent=item.title;
  modalSubject.textContent=item.subject;
  modalChapter.textContent=item.chapter;
  modalDescription.textContent=item.description;
  modal.hidden=false;
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  modalCloseButton.focus();
}

function closeModal(){
  modal.hidden=true;
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-close-modal]').forEach(element=>element.addEventListener('click',closeModal));
modalCloseButton.addEventListener('click',closeModal);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)closeModal();});
clearSearch.addEventListener('click',()=>{search.value='';search.focus();render();});
resetFilters.addEventListener('click',()=>{selected='All';search.value='';render();document.querySelector('#resources').scrollIntoView({behavior:'smooth'});});

function render(){
  const term=search.value.trim().toLowerCase();
  const visible=resources.filter(item=>{
    const subjectMatch=selected==='All'||item.subject===selected;
    const text=`${item.title} ${item.subject} ${item.chapter} ${item.description}`.toLowerCase();
    return subjectMatch&&(!term||text.includes(term));
  });

  grid.innerHTML=visible.map(item=>`
    <article class="card">
      <div class="card-meta"><span class="tag">${item.subject}</span><span>${item.type}</span></div>
      <p class="chapter">${item.chapter}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="card-footer"><span>Preview resource</span><button type="button" data-resource-index="${resources.indexOf(item)}">View</button></div>
    </article>`).join('');

  grid.querySelectorAll('[data-resource-index]').forEach(button=>button.addEventListener('click',()=>openResource(resources[Number(button.dataset.resourceIndex)])));
  count.textContent=`${visible.length} of ${resources.length}`;
  empty.hidden=visible.length!==0;
  clearSearch.hidden=search.value.length===0;
  [...filters.children].forEach(button=>{
    const active=button.textContent===selected;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
}

search.addEventListener('input',render);
render();
