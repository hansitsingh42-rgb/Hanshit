document.getElementById('year').textContent = new Date().getFullYear();

// The dashboard intentionally starts empty rather than displaying fake visitor data.
// Connect a privacy-first analytics provider to populate the metrics.
const analyticsConfig = {
  provider: 'cloudflare-web-analytics',
  connected: false
};

const state = document.getElementById('connectionState');
const setupText = document.getElementById('setupText');
if (analyticsConfig.connected) {
  state.textContent = 'Connected';
  state.previousElementSibling.style.background = '#43e8dc';
  state.previousElementSibling.style.boxShadow = '0 0 15px #43e8dc';
  setupText.textContent = 'Analytics collection is enabled. Aggregate visitor metrics will appear as the provider processes visits.';
}

// Small entrance animation for dashboard cards.
document.querySelectorAll('.metrics article,.panel').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  el.style.animation = `cardIn .55s ease ${Math.min(i * 45, 500)}ms forwards`;
});

const style = document.createElement('style');
style.textContent = '@keyframes cardIn{to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(style);
