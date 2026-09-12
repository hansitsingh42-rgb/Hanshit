(() => {
  const root = document.querySelector('[data-github-contributions]');
  if (!root) return;

  const username = root.dataset.username;
  const grid = root.querySelector('.contribution-grid');
  const total = root.querySelector('[data-contribution-total]');
  const status = root.querySelector('[data-contribution-status]');
  const profileLink = root.querySelector('[data-contribution-profile]');

  const buildSnapshot = () => {
    if (document.querySelector('[data-build-snapshot]')) return;
    const section = document.createElement('section');
    section.className = 'panel build-snapshot';
    section.dataset.buildSnapshot = '';
    section.innerHTML = `
      <div class="panel-head">
        <div><h3>Build Snapshot</h3><span>What I'm building, learning & improving</span></div>
        <span class="snapshot-live"><i></i> Active</span>
      </div>
      <div class="snapshot-grid">
        <article><span>01</span><strong>Build</strong><p>Practical student tools, web projects and a personal study library.</p></article>
        <article><span>02</span><strong>Learn</strong><p>C, JavaScript, Git & GitHub, networking and core computer science.</p></article>
        <article><span>03</span><strong>Improve</strong><p>Clean UI, useful documentation, reliable demos and better engineering habits.</p></article>
      </div>
      <div class="snapshot-roadmap"><span>NOW</span><b>Build → Test → Document → Improve → Repeat</b></div>`;
    root.parentNode.insertBefore(section, root);
  };

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
  buildSnapshot();
  renderOfficialCalendar();
})();
