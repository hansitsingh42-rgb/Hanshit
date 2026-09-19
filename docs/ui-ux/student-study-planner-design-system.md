# Student Study Planner — Design System

## Design principles

1. **Clarity first** — the next action should be easy to identify.
2. **Low friction** — common study actions should take few steps.
3. **Calm hierarchy** — typography and spacing carry the hierarchy instead of decoration.
4. **Accessible by default** — keyboard, reduced motion, readable labels, and responsive layouts are baseline requirements.
5. **Privacy-conscious** — the interface should not require personal data for a simple planning task.

## Core components

- Top navigation
- Theme toggle
- Primary action button
- Metric card
- Timeline item
- Week-day card
- Add-session control
- Focus timer
- Status message
- Privacy note

## Component states

Each interactive component should be reviewed for:

Default → Hover → Focus → Active → Disabled → Error/Unavailable → Success/Complete

## Visual tokens

- --panel: surface
- --line: border/divider
- --muted: secondary text
- --accent: primary action/focus
- --soft: subtle highlight/background
- --danger: error messaging

The implementation keeps these tokens centralized in style.css so future visual changes remain consistent.

## Accessibility states

Keyboard focus uses :focus-visible. Reduced-motion preferences are respected with prefers-reduced-motion. Stateful controls expose their status through ARIA attributes and live status text where appropriate.

## Future Figma mapping

When Figma tooling is available, map these components into the existing UX foundation without replacing or deleting existing CSE work:

1. Foundations / tokens
2. Components
3. States and variants
4. Dashboard wireframe
5. Planner wireframe
6. Focus-session UI
7. Prototype flow
8. Usability-test revisions
9. Final case-study evidence
