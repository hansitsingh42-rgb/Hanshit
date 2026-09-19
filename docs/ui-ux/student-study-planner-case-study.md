# Student Study Planner — UX Case Study

**Status:** Prototype implemented — UX foundation + responsive interaction states  
**Scope:** Student planning, weekly scheduling, and focused study sessions

## 1. Problem

Students can lose time deciding what to study next, balancing multiple subjects, and starting a focused session. The planner explores a low-friction way to make the next action visible without requiring an account.

## 2. Users and context

**Primary user:** a student managing several subjects and short study sessions.

**Context assumptions:** the user may study on a laptop or phone, switch between subjects, and prefer a simple interface over a feature-heavy productivity system.

These are design assumptions, not validated research findings.

## 3. Research plan

Before treating the design as validated, test with students using tasks such as:

1. Find today's next subject.
2. Find a session in the weekly plan.
3. Start, pause, and reset a focus session.
4. Explain what data the prototype stores.
5. Repeat the tasks on a small screen.

Measure task completion, time-on-task, navigation errors, accessibility issues, and qualitative feedback.

## 4. Product goals

- Make the next study action immediately visible.
- Keep weekly workload understandable.
- Make starting a focus session require minimal steps.
- Communicate state changes clearly.
- Avoid unnecessary personal-data collection.

## 5. Information architecture

**Study Planner**
- Dashboard
  - Next up
  - Today's plan
  - Weekly progress
- Planner
  - Week view
  - Add-session affordances
- Focus
  - Subject/context
  - Timer
  - Start/Pause
  - Reset
  - Completion status

## 6. Core user flow

**Dashboard → Start focus → Running → Pause/Resume → Complete → Break**

Alternative planning flow:

**Dashboard → Planner → Select day → Add-session preview**

The current prototype intentionally does not persist the added session.

## 7. UI decisions

- Clear primary action for the next task.
- Consistent card and spacing system.
- Responsive week grid that collapses on smaller screens.
- Light/dark theme support.
- Visible keyboard focus.
- Reduced-motion support.
- Status text for pause, reset, and completion.
- Accessible labels for timer and day controls.

## 8. Interaction-state coverage

The prototype documents and implements these states:

- Default
- Active navigation
- Today
- Focus running
- Focus paused
- Focus completed
- Timer reset
- Add-session preview
- Disabled control styling
- Keyboard focus
- Reduced-motion preference
- JavaScript unavailable notice

## 9. Accessibility

Implemented baseline:

- Semantic landmarks and headings.
- Skip-to-content link.
- Button elements for actions.
- aria-current for active navigation.
- aria-pressed for toggle/stateful controls.
- Timer labels that expose remaining time.
- Live status messaging for important state changes.
- :focus-visible keyboard indication.
- Reduced-motion media query.
- Responsive layouts and touch-friendly controls.

Accessibility still requires real assistive-technology testing before being called fully compliant.

## 10. Privacy and security

This is a static prototype with a deliberately small attack surface.

- No account system.
- No API keys, passwords, tokens, or secrets.
- No third-party JavaScript dependencies.
- No analytics or tracking.
- No network/API requests from the prototype.
- Timer state remains in memory and is lost on reload.
- Content Security Policy restricts scripts, styles, connections, objects, and form actions to the local origin.
- Referrer policy limits cross-origin referrer detail.
- User-entered or server-provided HTML is not rendered by the current JavaScript.
- No eval, dynamic script injection, or inline event handlers.

See SECURITY.md for the project security baseline.

## 11. Evidence status

| Area | Status |
|---|---|
| Problem framing | Documented assumption |
| User/context model | Documented assumption |
| Research plan | Ready for testing |
| IA | Defined |
| User flow | Defined |
| Wireframe direction | Defined in UX foundation |
| Responsive UI | Implemented |
| Interaction states | Implemented |
| Accessibility baseline | Implemented; testing pending |
| Privacy/security baseline | Implemented |
| Figma implementation | Pending tool availability |
| Usability testing | Pending |
| Final case study | Pending validated evidence |

## 12. Next validation step

Run the five-task usability plan with a small student test group, record observations without collecting unnecessary personal information, then revise the flow and UI based on observed evidence.
