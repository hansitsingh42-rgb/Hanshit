(() => {
  const root = document.querySelector('[data-github-contributions]');
  if (!root) return;

  const username = root.dataset.username;
  const grid = root.querySelector('.contribution-grid');
  const total = root.querySelector('[data-contribution-total]');
  const status = root.querySelector('[data-contribution-status]');
  const profileLink = root.querySelector('[data-contribution-profile]');

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;

  async function load() {
    status.textContent = 'Loading live GitHub contribution data…';
    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { login: username } })
      });
      const payload = await response.json();
      if (!response.ok || payload.errors || !payload.data?.user) throw new Error('GitHub contribution data unavailable');

      const calendar = payload.data.user.contributionsCollection.contributionCalendar;
      total.textContent = `${calendar.totalContributions.toLocaleString()} contributions in the last year`;
      grid.innerHTML = '';

      calendar.weeks.forEach((week) => {
        const column = document.createElement('div');
        column.className = 'contribution-week';
        week.contributionDays.forEach((day) => {
          const cell = document.createElement('span');
          cell.className = `contribution-cell level-${day.contributionLevel.toLowerCase().replace('_', '-')}`;
          cell.title = `${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'} on ${day.date}`;
          cell.setAttribute('aria-label', cell.title);
          column.appendChild(cell);
        });
        grid.appendChild(column);
      });
      status.textContent = 'Live data from GitHub';
      profileLink.href = `https://github.com/${encodeURIComponent(username)}`;
    } catch (error) {
      grid.innerHTML = '<p class="contribution-error">Live contribution data could not be loaded right now. Open the GitHub profile to view the official contribution calendar.</p>';
      status.textContent = 'GitHub data unavailable';
    }
  }

  load();
})();
