# Deployment verification

## Current status

The project is a secure frontend foundation and workflow prototype. Production email sending is not enabled.

## Required checks before production

1. Run dependency and secret scans.
2. Build the application from a clean checkout.
3. Verify security headers and CSP.
4. Verify all authenticated routes require authentication.
5. Verify campaign ownership and tenant isolation.
6. Verify CSRF protection for cookie-authenticated state changes.
7. Verify rate limits on authentication, campaign, audience, automation, and sending endpoints.
8. Verify provider webhook signatures and replay protection.
9. Verify unsubscribe, suppression, bounce, and consent enforcement.
10. Verify logs contain no credentials, authorization headers, or unnecessary recipient/message content.
11. Run responsive keyboard and accessibility smoke tests.
12. Test production error responses for information leakage.

Do not enable production delivery until all security-critical backend checks pass.