# Engineering Quality

This repository is a portfolio and learning workspace. The goal is to show practical engineering habits through the code and documentation, without overstating experience.

## Current engineering baseline

- **Security policy:** vulnerability reporting and secret-handling guidance are documented in [SECURITY.md](../SECURITY.md).
- **Static-site deployment:** GitHub Pages deployment validates the expected portfolio/project files before publishing.
- **Security analysis:** CodeQL is configured for JavaScript and C/C++.
- **Repository hygiene:** local environment files, dependency artifacts, logs and build output are ignored by .gitignore.
- **Change review:** pull requests use a review checklist covering preservation, verification, secrets and limitations.
- **Ownership:** repository-wide CODEOWNERS identifies the maintainer for review routing.

## Verification philosophy

Changes should be small, reviewable and reproducible. A change is not considered complete merely because it looks correct in the browser; relevant syntax, deployment paths and security-sensitive behavior should also be checked.

## Evidence over claims

Project documentation should distinguish:

1. **Implemented** — behavior that exists in the repository.
2. **Verified** — behavior that has been checked by an automated or repeatable validation.
3. **Planned** — a future improvement that is not yet implemented.

This keeps the portfolio honest while making the engineering process visible to reviewers and recruiters.
