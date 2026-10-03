# Repository Architecture

## Purpose

Hanshit is a CSE student developer portfolio and a collection of practical CSE learning projects. The repository is intentionally organized so portfolio presentation, individual projects, documentation, and engineering automation can evolve independently.

## Top-level structure

| Area | Purpose |
|---|---|
| `index.html`, `style.css`, `script.js` | Main portfolio experience |
| `projects/` | Individual CSE/student projects |
| `jems/` | Jems AI project |
| `pdf-studio/` | PDF Studio project |
| `assets/` | Portfolio visual assets and reusable media |
| `.github/` | CI, security, contribution and repository automation |
| `docs/` | Engineering and project documentation |
| `demo/` | Demonstration material |

## Engineering flow

`Idea → Problem → Plan → Design → Implement → Validate → Secure → Document → Deploy → Improve`

## Evidence model

Each important project should expose, where applicable:

- Problem and intended user
- Features and scope
- Architecture or data flow
- Validation and error handling
- Accessibility considerations
- Security boundary and limitations
- Testing/verification evidence
- Live preview and source location
- Known limitations and next steps

## Repository rules

1. Preserve existing functionality unless a change explicitly requires replacement.
2. Do not commit secrets, credentials, tokens, private keys or personal documents.
3. Prefer small, reviewable commits.
4. Keep claims in documentation aligned with what is actually implemented.
5. Use CI and security scanning as evidence, not as a substitute for manual review.
6. Treat browser-side validation as UX validation; it is not a replacement for server-side security.
7. Keep dependencies purposeful and review updates through Dependabot or equivalent tooling.

## Definition of done

A change is considered complete when the affected implementation is updated, relevant validation passes, security implications are reviewed, documentation is updated when behavior changes, and the live/project path is checked when applicable.
