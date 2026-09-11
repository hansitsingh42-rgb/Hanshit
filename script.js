const search = document.querySelector('#search');
const filters = document.querySelectorAll('.filter');
const cards = [...document.querySelectorAll('.subject-card')];
const emptyState = document.querySelector('#emptyState');
const toast = document.querySelector('#toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function filterSubjects() {
  const term = search.value.trim().toLowerCase();
  const active = document.querySelector('.filter.active').dataset.filter;
  let visible = 0;

  cards.forEach(card => {
    const matchesCategory = active === 'all' || card.dataset.category === active;
    const matchesSearch = !term || card.dataset.name.toLowerCase().includes(term);
    const shouldShow = matchesCategory && matchesSearch;
    card.hidden = !shouldShow;
    if (shouldShow) visible++;
  });

  emptyState.hidden = visible !== 0;
}

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    filterSubjects();
  });
});

search.addEventListener('input', filterSubjects);

document.querySelectorAll('.text-btn').forEach(button => {
  button.addEventListener('click', () => {
    showToast(`${button.dataset.subject} resources will be added in the next version.`);
  });
});

document.querySelector('#randomBtn').addEventListener('click', () => {
  const visibleCards = cards.filter(card => !card.hidden);
  const pool = visibleCards.length ? visibleCards : cards;
  const selected = pool[Math.floor(Math.random() * pool.length)];
  selected.scrollIntoView({ behavior: 'smooth', block: 'center' });
  selected.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.03)' },
    { transform: 'scale(1)' }
  ], { duration: 500 });
  showToast(`Try studying: ${selected.dataset.name}`);
});
