# Application shell

This stage adds the authentication/application-shell UI without pretending that authentication is already secure or connected.

## Security boundary

The login page performs only client-side validation messaging. It does not transmit, persist, or process real credentials.

A real authentication service must be implemented server-side before this becomes a production login.

Required controls include secure HttpOnly SameSite cookies, CSRF protection where applicable, rate limiting, password hashing through a maintained authentication provider/library, session rotation, authorization checks on every protected resource, audit logging without secrets, and generic authentication error responses.

## Stage 11 authentication

The login flow now calls the server-side auth endpoint. Production requirements include a PostgreSQL-compatible database, secure HttpOnly SameSite session cookies, server-side scrypt password verification, generic authentication errors, login throttling, session expiration, same-origin checks, and server-side authorization for every protected resource.
