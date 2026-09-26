# Backend API contract

Stage 10 establishes the backend boundary without pretending authentication or email delivery is complete.

## Health

GET /api/health

Returns a minimal non-sensitive service status. It does not expose environment variables, versions, host details, or credentials.

## Planned authenticated endpoints

The following endpoints are contracts for the next backend implementation:

- POST /api/auth/login
- POST /api/auth/logout
- GET /api/campaigns
- POST /api/campaigns
- GET /api/campaigns/:id
- PATCH /api/campaigns/:id
- DELETE /api/campaigns/:id
- GET /api/audiences
- POST /api/audiences
- GET /api/automations
- POST /api/automations
- GET /api/analytics/:campaignId
- POST /api/provider/webhook

All state-changing endpoints must authenticate the session, authorize the tenant/resource, validate input server-side, enforce CSRF protection when cookie authentication is used, and apply appropriate rate limits.

Provider credentials and webhook secrets are server-only.

## Error policy

Production responses must use stable generic error codes/messages. Internal database, provider, stack-trace, and credential details must never be returned to clients.