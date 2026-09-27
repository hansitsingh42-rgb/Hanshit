# Deployment verification

## Current status

The project has a security-hardened backend foundation and a non-sending email delivery pipeline. **Production email delivery is not enabled yet.**

## Verified in code

- [x] Security headers and CSP are configured.
- [x] Authenticated routes use server-side sessions.
- [x] Campaign, audience, contact, and automation ownership is enforced server-side.
- [x] CSRF and same-origin protection cover cookie-authenticated state changes.
- [x] Input validation and endpoint-specific rate limits are implemented.
- [x] Delivery jobs have idempotency, bounded retries, and stale-job recovery.
- [x] Provider webhooks require signature verification and replay protection.
- [x] Consent, unsubscribe, suppression, and bounce controls exist.
- [x] Provider credentials and worker secrets remain server-side.
- [x] CI is configured for syntax checks, security tests, and high-severity dependency auditing.

## Remaining production gates

1. Successfully run the configured test suite in CI or a controlled environment.
2. Generate and commit a genuine `package-lock.json`; do not use a fabricated lockfile.
3. Replace the process-local rate limiter with a shared atomic store for multi-instance/serverless deployment.
4. Configure a trusted scheduler for the protected delivery process/recovery endpoints.
5. Implement and sandbox-test the real provider adapter before enabling email delivery.
6. Run PostgreSQL-backed integration tests and provider-sandbox tests.
7. Verify logs contain no credentials, authorization headers, or unnecessary recipient/message content.
8. Complete responsive, keyboard, accessibility, and production error-response smoke tests.
9. Verify deployment secrets are configured only through the server-side environment/secret store.
10. Perform a final clean-checkout deployment verification before enabling real delivery.

## Release rule

Do not enable production email delivery until the remaining security-critical gates above are verified.
