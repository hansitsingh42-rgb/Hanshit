(() => {
  const $ = (id) => document.getElementById(id);
  const slide = (title, html) => {
    if (typeof window.openSlide === 'function') window.openSlide(title, html);
  };
  const close = () => {
    if (typeof window.closeSlide === 'function') window.closeSlide();
  };

  const original = {
    addSubject: $('addSubject')?.onclick,
    addAssignment: $('addAssignment')?.onclick,
    resetDemo: $('resetDemo')?.onclick,
    startTimer: $('startTimer')?.onclick,
    pauseTimer: $('pauseTimer')?.onclick,
    resetTimer: $('resetTimer')?.onclick,
    themeToggle: $('themeToggle')?.onclick
  };

  if ($('addSubject')) {
    $('addSubject').onclick = () => {
      slide('Add Subject', '<div class="slide-card"><h3>New subject</h3><p>Add a subject and set its current attendance. The form will open after this transition.</p></div>');
      setTimeout(() => $('subjectDialog')?.showModal(), 320);
    };
  }

  if ($('addAssignment')) {
    $('addAssignment').onclick = () => {
      slide('Add Assignment', '<div class="slide-card"><h3>New assignment</h3><p>Create a task with a clear due date. The form will open after this transition.</p></div>');
      setTimeout(() => $('assignmentDialog')?.showModal(), 320);
    };
  }

  if ($('resetDemo')) {
    $('resetDemo').onclick = () => {
      slide('Reset Demo Data', '<div class="slide-card"><h3>Reset planner data?</h3><p>This restores the original demo subjects, assignments and notes.</p></div><div class="slide-actions"><button class="btn primary" id="confirmResetSlide" type="button">Reset now</button><button class="btn" id="cancelResetSlide" type="button">Cancel</button></div>');
      setTimeout(() => {
        $('confirmResetSlide')?.addEventListener('click', () => {
          if (typeof original.resetDemo === 'function') original.resetDemo();
          close();
        });
        $('cancelResetSlide')?.addEventListener('click', close);
      }, 30);
    };
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    if (target.matches('.dialog-head .close, dialog menu button')) return;
    if (target.id === 'closeSlide') return;
    if (target.id === 'addSubject' || target.id === 'addAssignment' || target.id === 'resetDemo') return;
    if (target.dataset.slideAction) return;

    const label = (target.textContent || '').trim();
    if (!label) return;

    if (target.id === 'themeToggle') return;
    if (target.id === 'startTimer') return;
    if (target.id === 'pauseTimer') return;
    if (target.id === 'resetTimer') return;

    if (target.dataset.removeSubject !== undefined) {
      slide('Subject Updated', '<div class="slide-card"><h3>Subject removed</h3><p>The subject was removed and your academic summary has been recalculated.</p></div>');
      return;
    }

    if (target.dataset.toggleAssignment !== undefined) {
      const done = label.toLowerCase() === 'done';
      slide(done ? 'Assignment Completed' : 'Assignment Reopened', `<div class="slide-card"><h3>${done ? 'Task completed' : 'Task reopened'}</h3><p>Your work queue has been updated.</p></div>`);
    }
  }, true);

  // Give the three timer controls their own transition screens while preserving timer logic.
  if ($('startTimer')) $('startTimer').onclick = () => {
    if (typeof original.startTimer === 'function') original.startTimer();
    slide('Focus Session', '<div class="slide-card"><h3>Focus session started</h3><p>The 25-minute timer is running and your study time is tracked locally.</p></div>');
  };
  if ($('pauseTimer')) $('pauseTimer').onclick = () => {
    if (typeof original.pauseTimer === 'function') original.pauseTimer();
    slide('Timer Paused', '<div class="slide-card"><h3>Focus session paused</h3><p>Your current timer state is preserved.</p></div>');
  };
  if ($('resetTimer')) $('resetTimer').onclick = () => {
    if (typeof original.resetTimer === 'function') original.resetTimer();
    slide('Timer Reset', '<div class="slide-card"><h3>25:00</h3><p>The focus timer is ready for a fresh session.</p></div>');
  };

  // Theme toggle gets a dedicated transition without replacing the existing theme logic.
  if ($('themeToggle')) $('themeToggle').onclick = () => {
    if (typeof original.themeToggle === 'function') original.themeToggle();
    const mode = document.body.dataset.theme === 'dark' ? 'Dark' : 'Light';
    slide(`${mode} Theme`, `<div class="slide-card"><h3>${mode} mode enabled</h3><p>The planner appearance has been updated.</p></div>`);
  };

  // Notes textarea already has a focused slide in the main script; keep it as-is.
})();
