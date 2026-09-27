# Security

This project is a security-first frontend foundation for an email campaign builder.

## Current controls

- No API keys, passwords, tokens, or credentials are stored in frontend source.
- No dynamic HTML injection, eval, or runtime code generation is used.
- JavaScript is limited to local navigation and non-networking login UI messaging.
- Security headers are defined in vercel.json.
- External script dependencies are not required.
- Navigation uses semantic links and an accessible menu button.
- Keyboard focus indicators are preserved.
- Reduced-motion preferences are respected.
- Login UI explicitly does not transmit credentials until a backend authentication service exists.

## Backend security controls implemented

- Authentication uses server-side sessions with hashed session tokens and scrypt password hashing.
- Cookie-authenticated state changes use CSRF and same-origin validation.
- Campaign, audience, contact, automation, and delivery APIs enforce authentication and tenant ownership.
- Delivery processing uses protected worker authentication, idempotency, retries, stale-job recovery, and signed webhook verification.
- Server-side provider credentials and worker secrets remain environment-only.
- Automated syntax/security tests and high-severity dependency auditing are configured in CI.

## Before production backend integration

- Keep provider credentials server-side.
- Validate and authorize every campaign, audience, template, and automation request on the server.
- Use secure, HttpOnly, SameSite cookies for browser sessions.
- Add CSRF protection where cookie-authenticated state-changing requests are used.
- Rate-limit authentication, campaign creation, and email-sending endpoints.
- Never log passwords, session tokens, authorization headers, or email content unnecessarily.
- Hash passwords with a maintained password-hashing implementation; never store plaintext passwords.
- Validate email addresses, template content, campaign IDs, and pagination server-side.
- Apply least-privilege database credentials and parameterized queries or ORM operations.
- Add dependency auditing, secret scanning, and automated security checks to CI.

## Provider configuration boundary

- `EMAIL_PROVIDER` and `EMAIL_PROVIDER_API_KEY` are server-only environment values.
- Provider configuration fails closed when the key is missing, too short, or accessed from browser code.
- The frontend must never receive provider credentials.
- A real provider adapter must support the delivery-job idempotency key and return a stable provider message ID for an accepted message.
- Provider-specific authentication, request signing, rate limits, and response handling must be implemented inside the server adapter.
- Do not log provider API keys, authorization headers, recipient lists, message bodies, or provider secrets.
