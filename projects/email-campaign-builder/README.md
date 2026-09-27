# Email Campaign Builder

A secure, developer-focused email campaign builder based on the supplied landing-page design.

## Purpose

The product purpose stays unchanged: **build, automate, and understand email marketing campaigns.**

## Current architecture

- Responsive marketing landing page and product UI
- Server-side authentication with protected sessions
- Campaign CRUD, scheduling, email content, audiences, contacts, and automation
- Consent, unsubscribe, suppression, and bounce controls
- PostgreSQL-backed delivery queue
- Bounded retries, idempotency, and stale-job recovery
- Server-only provider integration boundary
- Signed provider webhook verification and replay protection
- Security headers, CSP, CSRF, same-origin checks, ownership isolation, validation, and rate limits
- Vercel scheduler configuration for delivery processing and stale-job recovery
- Automated syntax/security checks through GitHub Actions

## Security status

The project has a **security-hardened backend foundation**, but real production email delivery is intentionally not enabled yet.

The current provider adapter is fail-closed/non-sending until a real provider implementation is configured and sandbox-tested. Browser code never receives provider credentials and never sends email directly.

## Development status

### Implemented

- [x] Landing page and responsive UI
- [x] Authentication/session flow
- [x] Campaign creation, editing, deletion, and scheduling
- [x] Email content editor and preview
- [x] Audience segments and contacts
- [x] Consent and unsubscribe/suppression controls
- [x] Automation workflow persistence
- [x] Delivery queue and worker boundary
- [x] Retry/recovery and idempotency controls
- [x] Provider webhook security
- [x] Protected Vercel delivery/recovery scheduler configuration
- [x] Security tests and CI security workflow

### Remaining production gates

- [ ] Successful execution of the configured test suite in CI or a controlled environment
- [ ] Genuine `package-lock.json` generated and committed
- [ ] Shared rate limiting for multi-instance/serverless production
- [ ] Real provider adapter and sandbox delivery tests
- [ ] PostgreSQL/provider integration tests
- [ ] Final accessibility, responsive, and production error-response verification

The scheduler configuration is now committed, but production still requires the deployment platform to be configured with the server-only `CRON_SECRET`.

## Local preview

Open `index.html` in a browser, or serve this directory with a static HTTP server.

For backend development, use Node.js 20+ and configure the server-side environment variables from `.env.example`.

## CI

GitHub Actions runs:

1. Dependency installation
2. Node syntax checks
3. Security tests
4. High-severity npm dependency audit

The repository intentionally does not contain a fabricated lockfile.

## Security documentation

- `SECURITY.md` — security requirements and implemented controls
- `SECURITY-AUDIT.md` — current security audit and remaining production gates
- `DEPLOYMENT-CHECKLIST.md` — release verification checklist
- `PRIVACY.md` — privacy and retention controls
- `PROVIDER-INTEGRATION.md` — provider boundary and delivery contract

## Repository safety

This project is isolated under `projects/email-campaign-builder/`. Existing repository projects are not modified or deleted as part of this project.
