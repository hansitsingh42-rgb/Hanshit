# Security Policy

## Supported Versions

This repository is primarily a student portfolio and learning project. Security fixes are applied to the current `main` branch.

## Reporting a Vulnerability

Please do not publish security-sensitive details in a public issue.

If you discover a vulnerability, use GitHub's private vulnerability reporting feature for this repository when available. Include:

- A clear description of the issue
- Steps to reproduce it safely
- The affected file or component
- The potential impact
- A suggested fix, if you have one

Do not include passwords, API keys, access tokens, personal documents, or other secrets in a report.

## Secret Handling

Never commit credentials, API keys, tokens, private certificates, or `.env` files containing secrets. Use GitHub Actions secrets or local environment variables for sensitive values.

## Scope

This policy covers the code and workflows in this repository. Third-party services and dependencies should be reported to their respective maintainers when the issue is outside this repository's control.
