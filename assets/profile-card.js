// Hanshit ProfileCard interaction — static adapter for the React Bits-style card.
// Keeps the portfolio dependency-free while matching the component's pointer tilt,
// glare tracking, touch-safe behavior, and reduced-motion handling.
(() => {
  const shell = document.querySelector('[data-profile-card]');
  const card = shell?.querySelector('.profile-card');
  if (!shell || !card) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');

  const reset = () => {
    shell.style.setProperty('--pc-x', '50%');
    shell.style.setProperty('--pc-y', '50%');
    shell.style.setProperty('--pc-rx', '0deg');
    shell.style.setProperty('--pc-ry', '0deg');
  };

  const update = (event) => {
    if (reducedMotion.matches || !pointerFine.matches) return;
    const rect = card.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    shell.style.setProperty('--pc-x', x + '%');
    shell.style.setProperty('--pc-y', y + '%');
    shell.style.setProperty('--pc-rx', ((x - 50) / 12) + 'deg');
    shell.style.setProperty('--pc-ry', ((50 - y) / 16) + 'deg');
  };

  card.addEventListener('pointermove', update, { passive: true });
  card.addEventListener('pointerleave', reset);
  card.addEventListener('pointercancel', reset);
  reducedMotion.addEventListener?.('change', reset);
  pointerFine.addEventListener?.('change', reset);
  reset();
})();