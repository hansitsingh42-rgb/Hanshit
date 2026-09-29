# Security Policy

## Supported versions

This repository is primarily a student portfolio and learning project. Security fixes are applied to the current `main` branch.

## Reporting a vulnerability

Please do not publish security-sensitive details in a public issue.

If you discover a vulnerability, use GitHub's private vulnerability reporting feature for this repository when available. Include a clear description, safe reproduction steps, the affected file or component, potential impact, and a suggested mitigation if known.

Never include passwords, API keys, access tokens, private keys, session cookies, personal documents, or other sensitive data in a report.

## Security baseline

- No production credentials are committed to source control.
- Secrets belong in GitHub Actions or hosting secret storage, not source files.
- Dependencies are checked with npm audit and Dependabot where available.
- CodeQL scans JavaScript and C/C++ code.
- GitHub Actions use least-privilege permissions where practical.
- CI validation runs before project changes are considered complete.
- Existing functionality is preserved while security fixes are applied.

## Secret exposure

If a credential is ever exposed, treat it as compromised immediately: revoke or rotate it at the issuing service, then remove the exposure appropriately. Deleting only a later commit is not sufficient because Git history can retain previously committed data.

## Scope

This policy covers the code and workflows in this repository. Issues in third-party services or dependencies should be reported to their respective maintainers when they are outside this repository's control.
