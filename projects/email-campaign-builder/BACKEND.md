# Backend foundation

The product is now ready for a server-side implementation boundary.

## Rules

- Browser code never receives provider credentials.
- Authentication must be implemented server-side.
- Campaign, audience, automation, and analytics data must be authorization-checked server-side.
- Input validation is repeated on the server even when the browser validates it.
- Database access uses parameterized queries or a maintained ORM.
- Sessions use secure HttpOnly SameSite cookies.
- State-changing cookie-authenticated requests require CSRF protection.
- Authentication and sending endpoints are rate-limited.
- Webhook signatures are verified before provider events are accepted.
- Secrets are loaded from deployment secret management, never from committed files.

The current API implementation intentionally contains only a non-sensitive health endpoint. This avoids creating an unauthenticated campaign API that could become a security vulnerability.