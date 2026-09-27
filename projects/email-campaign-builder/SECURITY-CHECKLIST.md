# Security audit checklist

## Frontend
- [x] No API keys, passwords, provider tokens, or session secrets in browser code
- [x] No eval or dynamic code generation
- [x] User-entered preview content uses DOM text APIs
- [x] No external JavaScript dependency
- [x] Responsive keyboard-accessible navigation and forms
- [x] Reduced-motion support inherited from the site stylesheet
- [x] Security headers configured in vercel.json

## Authentication
- [x] Login UI does not transmit credentials before backend authentication exists
- [ ] Production authentication endpoint
- [ ] Password hashing
- [ ] Secure HttpOnly SameSite session cookies
- [ ] Session rotation and revocation
- [ ] CSRF protection where cookie-authenticated state changes are used
- [ ] Login and session rate limiting
- [ ] Generic production authentication errors

## Campaign and audience authorization
- [ ] Server-side validation for every campaign field
- [ ] Campaign ownership checks on every read/write operation
- [ ] Tenant isolation
- [ ] Audience consent/opt-in enforcement
- [ ] Suppression and unsubscribe enforcement

## Email delivery
- [ ] Provider credentials stored in server-side secrets
- [ ] Sender-domain verification
- [ ] Idempotent sending jobs
- [ ] Provider webhook signature verification
- [ ] Rate limits and provider quotas
- [ ] Retry and bounce handling

## Privacy and observability
- [ ] Data retention policy
- [ ] Minimal recipient-level tracking data
- [ ] Access-controlled analytics
- [ ] Logs exclude credentials and unnecessary message content
- [ ] Audit events for privileged actions

## Deployment verification
Before production, run dependency auditing, secret scanning, static checks, build checks, security-header checks, authentication tests, authorization tests, webhook verification tests, and browser smoke tests.

The frontend-only project is intentionally not marked production-ready until the unchecked backend controls exist.

## Stage 35 verification scope

- [x] Backend JavaScript syntax checks include authentication, campaign mutations, provider webhooks, delivery processing/recovery, provider HTTP, CSRF helpers, and worker modules.
- [x] Delivery worker requires a server-side secret and rejects unauthenticated requests.
- [x] Provider credentials remain server-only.
- [x] Delivery jobs use bounded claiming, idempotency keys, retry limits, and stale-job recovery.
- [x] Provider webhook events use signature verification and replay protection.
- [x] Permanent provider/worker errors are not treated as successful delivery.

Automated syntax checks verify parsing only; a production launch still requires integration tests against a controlled database and provider sandbox, plus dependency/security scanning.
