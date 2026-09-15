(() => {
  // Small runtime guard: keep the interactive planner from failing silently if
  // a future edit removes one of its shared slide functions.
  window.addEventListener('error', (event) => {
    console.error('[Student Academic Planner]', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Student Academic Planner] Unhandled promise rejection', event.reason);
  });
})();
