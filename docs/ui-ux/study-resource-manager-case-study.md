# Study Resource Manager — UX Case Study

**Status:** Implemented browser prototype  
**Role:** Student developer / UI implementer

## User

A student who keeps useful notes, videos, PDFs and links and wants to find them quickly without maintaining a server account.

## Problem

A simple bookmark list becomes hard to scan as resources grow. The project explores a lightweight library that combines search, subject/type filters and favorites while keeping data local to the browser.

## Research and assumptions

No formal research has been completed. The initial assumptions are:

- search is faster than scanning a long list;
- students may remember a subject but not the exact resource title;
- favorites are useful for frequently revisited material;
- local-only storage is appropriate for a simple personal prototype.

These assumptions need validation with real users.

## Design decisions

- Put search near the top of the interface.
- Keep filters visible rather than hiding them behind a complex menu.
- Make the favorite state persistent.
- Use responsive cards so the same information hierarchy works on small screens.
- Keep external resource opening explicit and separate from editing/deleting actions.
- Treat LocalStorage failure as a recoverable browser limitation instead of assuming storage always works.

## Core flow

```text
Open Library → Search / Filter → Review Resource → Open or Favorite
```

## Wireframes / Figma

No final Figma file is being claimed for this project yet. The implemented interface is the current design artifact.

## What I built

- Search and instant filtering
- Subject and resource-type filters
- Favorites and deletion flows
- LocalStorage persistence
- Light/dark theme persistence
- Responsive desktop/mobile layout
- Safe external-link handling

## Accessibility and responsive thinking

The interface uses native form controls, buttons for actions and responsive layout rules. A fuller accessibility review should still cover keyboard-only use, focus order, zoom/reflow and screen-reader announcements.

## What I learned

Even a small browser app needs a clear state model. Search, filters, favorites, deletion and persistence can easily become confusing if the UI does not clearly communicate which state is active.

## What I would improve

1. Test the information hierarchy with students.
2. Add real screenshots after final visual review.
3. Explore import/export so users can back up local resources.
4. Improve empty and first-use guidance based on observed behavior.
5. Consider a server-backed version only after the local workflow is validated.
