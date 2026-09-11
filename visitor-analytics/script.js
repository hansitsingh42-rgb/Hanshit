const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Keep the dashboard honest: no fabricated visitor numbers or visitor identities.
const analyticsConfig = {
  provider: 'cloudflare-web-analytics',
  connected: false
};

const connectionState = document.getElementById('connectionState');
const setupText = document.getElementById('setupText');
const stateDot = document.querySelector('.state-dot');

if (analyticsConfig.connected) {
  if (connectionState) connectionState.textContent = 'Connected';
  if (stateDot) {
    stateDot.style.background = '#25e5d0';
    stateDot.style.boxShadow = '0 0 14px #25e5d0';
  }
  if (setupText) {
    setupText.textContent = 'Analytics collection is enabled. Aggregate visitor metrics will appear as the provider processes visits.';
  }
}

// Staggered entrance animation for the dashboard cards.
const cards = document.querySelectorAll('.metric, .panel');
cards.forEach((card, index) => {
  card.style.setProperty('--delay', `${Math.min(index * 45, 500)}ms`);
  card.classList.add('reveal');
});

// Keep navigation links ordinary and predictable; no tracking parameters are added.
document.querySelectorAll('.sidebar nav a').forEach((link) => {
  link.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') link.click();
  });
});
