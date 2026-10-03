# Backend foundation

The Email Campaign Builder now contains a server-side backend foundation. Production delivery remains gated until the remaining integration and deployment checks are completed.

## Implemented boundary

- Server-side registration, login, session lookup and logout
- Password hashing with scrypt and hashed session tokens
- Secure HttpOnly + SameSite session cookie handling
- Same-origin checks for cookie-authenticated mutations
- Login and registration throttling
- Server-side campaign, audience and contact authorization
- Server-side input validation
- PostgreSQL access through parameterized queries
- Provider credentials kept server-side
- Delivery idempotency, bounded retries and stale-job recovery
- Signed provider webhook verification with replay protection
- Security headers and no-store responses for sensitive API paths

## Production gates

The backend should remain non-sending until controlled integration tests, dependency/security verification, shared production rate limiting, trusted scheduler configuration, and a real provider sandbox test are complete.

The static GitHub Pages preview intentionally excludes backend execution paths and secret-bearing configuration.
