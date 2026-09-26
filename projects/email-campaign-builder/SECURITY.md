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