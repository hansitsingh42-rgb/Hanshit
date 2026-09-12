(() => {
  const root = document.querySelector('[data-github-contributions]');
  if (!root) return;

  const username = root.dataset.username;
  const grid = root.querySelector('.contribution-grid');
  const total = root.querySelector('[data-contribution-total]');
  const status = root.querySelector('[data-contribution-status]');
  const profileLink = root.querySelector('[data-contribution-profile]');

  const renderOfficialCalendar = () => {
    const image = document.createElement('img');
    image.className = 'official-contribution-calendar';
    image.alt = `${username} GitHub contribution calendar`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.src = `https://github.com/users/${encodeURIComponent(username)}/contributions`;
    image.addEventListener('load', () => {
      total.textContent = 'GitHub contribution activity';
      status.textContent = 'Live calendar from GitHub';
    });
    image.addEventListener('error', () => {
      total.textContent = 'Contribution calendar';
      status.textContent = 'Open GitHub to view the official calendar';
    });
    grid.innerHTML = '';
    grid.appendChild(image);
  };

  profileLink.href = `https://github.com/${encodeURIComponent(username)}`;
  renderOfficialCalendar();
})();
