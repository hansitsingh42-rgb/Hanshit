# Student Productivity Dashboard — UX Case Study

**Status:** Implemented browser prototype  
**Role:** Student developer / UI implementer

## User

A student who wants a quick view of daily tasks, study time and a focused session without opening a complex productivity system.

## Problem

Study planning can become fragmented across task lists, timers and progress notes. This prototype combines those small workflows into one dashboard.

## Research and assumptions

No formal user research has been completed. The design starts from these assumptions:

- students need to see the next actionable tasks quickly;
- a short focus timer can reduce setup friction;
- visible progress can help users understand their current workload;
- local browser storage is sufficient for a personal prototype.

These are hypotheses, not validated outcomes.

## Design decisions

- Keep daily tasks as the primary workflow.
- Make the focus timer visible without turning it into the whole interface.
- Show completion percentage as a summary, not as a performance judgment.
- Persist useful state locally so a refresh does not immediately erase work.
- Keep controls explicit and keyboard accessible.
- Support responsive layouts and theme preferences.

## Core flow

```text
Open Dashboard → Review Tasks → Start Focus Session → Work → Reset/Continue → Review Progress
```

## Wireframes / Figma

No final Figma file is being claimed yet. The implemented browser interface is the current design artifact.

## What I built

- Add, complete and delete task flows
- Completion percentage calculation
- Focus timer with reset
- Study-time counter
- Subject progress cards
- LocalStorage persistence
- Light/dark theme
- Responsive desktop/mobile layout

## Accessibility and responsive thinking

The prototype uses semantic controls and responsive layout rules. A full accessibility pass should still include keyboard-only testing, screen-reader verification, reduced-motion checks and mobile reflow testing.

## What I learned

Combining multiple small workflows makes state management and information hierarchy more important. A dashboard should answer “what should I do next?” before showing secondary metrics.

## What I would improve

1. Test the dashboard with students performing common study tasks.
2. Validate whether the progress information is actually useful.
3. Improve first-use guidance and empty states.
4. Add verified screenshots and a documented design system.
5. Revisit the timer interaction after usability testing rather than adding more features by default.
