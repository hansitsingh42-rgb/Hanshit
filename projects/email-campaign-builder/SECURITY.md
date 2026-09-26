# Security

This project is a security-first frontend foundation for an email campaign builder.

## Current controls

- No API keys, passwords, tokens, or credentials are stored in frontend source.
- No dynamic HTML injection, eval, or runtime code generation is used.
- JavaScript is limited to the local navigation interaction.
- Security headers are defined in vercel.json.
- External script dependencies are not required.
- Navigation uses semantic links and an accessible menu button.
- Keyboard focus indicators are preserved.
- Reduced-motion preferences are respected.
- Production email delivery and authentication are intentionally not implemented in the frontend.

## Before production backend integration

- Keep all provider credentials server-side.
- Validate and authorize every campaign, audience, template, and automation request on the server.
- Use secure, HttpOnly, SameSite cookies for browser sessions.
- Add CSRF protection where cookie-authenticated state-changing requests are used.
- Rate-limit authentication, campaign creation, and email-sending endpoints.
- Validate email addresses, template content, campaign IDs, and pagination server-side.
- Apply least-privilege database credentials and parameterized queries or ORM operations.
- Log security events without storing message content, passwords, tokens, or unnecessary personal data.
- Add dependency auditing, secret scanning, and automated security checks to CI.