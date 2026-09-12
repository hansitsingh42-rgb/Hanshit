(() => {
  const root = document.querySelector('[data-github-contributions]');
  if (!root) return;

  const username = root.dataset.username;
  const grid = root.querySelector('.contribution-grid');
  const total = root.querySelector('[data-contribution-total]');
  const status = root.querySelector('[data-contribution-status]');
  const profileLink = root.querySelector('[data-contribution-profile]');

  const render = (calendar) => {
    total.textContent = `${Number(calendar.totalContributions || 0).toLocaleString()} contributions in the last year`;
    grid.innerHTML = '';

    (calendar.weeks || []).forEach((week) => {
      const column = document.createElement('div');
      column.className = 'contribution-week';

      (week.contributionDays || []).forEach((day) => {
        const level = String(day.contributionLevel || 'NONE').toLowerCase().replace('_', '-');
        const count = Number(day.contributionCount || 0);
        const cell = document.createElement('span');
        cell.className = `contribution-cell level-${level}`;
        cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${day.date}`;
        cell.setAttribute('aria-label', cell.title);
        column.appendChild(cell);
      });

      grid.appendChild(column);
    });
  };

  async function load() {
    status.textContent = 'Loading GitHub contribution data…';
    profileLink.href = `https://github.com/${encodeURIComponent(username)}`;

    try {
      const response = await fetch('assets/contributions.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const calendar = await response.json();
      if (!Array.isArray(calendar.weeks) || calendar.weeks.length === 0) {
        throw new Error('Contribution calendar is not populated yet');
      }

      render(calendar);
      status.textContent = 'Updated automatically from GitHub';
    } catch (error) {
      grid.innerHTML = '<p class="contribution-error">Contribution data is being updated. Open the GitHub profile to view the official calendar.</p>';
      total.textContent = 'Contribution calendar';
      status.textContent = 'Data update pending';
    }
  }

  load();
})();
