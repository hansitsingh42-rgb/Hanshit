# Email Campaign Builder

A developer-focused email campaign builder based on the supplied landing-page design.

## Purpose

The product purpose stays unchanged: build, automate, and understand email marketing campaigns.

## Build sequence

1. Secure responsive landing-page foundation
2. Authentication and protected application shell
3. Campaign creation workflow
4. Email template and editor workflow
5. Audience and segmentation
6. Automation workflows
7. Campaign analytics
8. Audience contacts and consent controls
9. Production email-provider integration
10. Security hardening and deployment verification

## Stage 1

This stage implements the supplied visual direction as a clean dependency-free frontend foundation: responsive navigation, hero section, campaign-builder visual, features, pricing, automation workflow preview, product demo section, sign-up CTA, accessible mobile navigation, and security headers.

No existing repository projects are modified or deleted by this project.

See SECURITY.md for the security requirements before backend integration.

## Local preview

Open index.html in a browser, or serve this directory with any static HTTP server.

## Security status

The current project is a frontend prototype with a documented production security boundary. Real authentication, persistent campaign data, provider credentials, and email delivery require the backend controls documented in `SECURITY-CHECKLIST.md` and `DEPLOYMENT-CHECKLIST.md`.

## Stage 10

A minimal server-side boundary has been added with a non-sensitive health endpoint and documented authenticated API contracts. No unauthenticated campaign API or provider credential handling has been added.

## Stage 22

Audience contacts are now persisted server-side with per-user ownership, normalized email addresses, consent timestamps, subscription states, segment membership, CSRF-protected writes, and authenticated contact listing. Unsubscribe status can be applied from the audience UI. Bulk import and provider delivery remain separate production-hardening steps.

## Stage 23

A server-side delivery queue foundation is now present. Scheduled campaigns can be prepared into idempotent per-contact queue jobs only when due, complete, owned by the authenticated user, and targeted at subscribed contacts. This stage does not send messages or expose provider credentials; a production worker and verified provider integration remain required.


## Stage 24

A server-only provider adapter boundary and atomic delivery-job claiming foundation are now present. Provider credentials remain outside browser code, and the current adapter deliberately refuses to send until a real provider configuration is added. The worker foundation increments attempts and claims eligible queued jobs transactionally; actual provider sending, webhook verification, retries, suppression handling, and replay protection remain production-gating work.

## Stage 25

Provider webhook security foundation is now present. Verified events require a server-side webhook secret, event identifier, HMAC verification, and replay protection. Delivery outcomes are applied transactionally; bounce events suppress contacts and unsubscribe events mark contacts unsubscribed. Invalid or replayed events do not mutate delivery state. A real provider must follow this adapter contract or use its own raw-body signature verifier before production use.

## Stage 26

Delivery processing now records claim timestamps and has a controlled retry/backoff and recovery boundary. Retries are capped at 10 attempts with increasing delays; exhausted jobs become failed instead of looping indefinitely. The provider remains intentionally unconfigured, so this stage does not send email.

## Stage 27

Delivery claiming is now bounded to 25 jobs per claim and uses PostgreSQL row locking with `SKIP LOCKED` to reduce concurrent-worker collisions. Stale processing jobs have a 15-minute recovery boundary and are re-queued with a controlled delay until the attempt cap is reached; exhausted jobs become failed. This is worker infrastructure only and does not send email by itself.

## Stage 28

A provider-neutral delivery adapter contract is now defined with a deterministic server-side idempotency key per delivery job. Claimed jobs can load campaign content and recipient state server-side, refuse delivery when a contact is no longer subscribed, and pass the idempotency key to the provider adapter. Accepted provider results must include a provider message ID before a job can be marked sent. The configured adapter remains intentionally non-sending until a real provider implementation and server-side credentials are added.

## Stage 29

Provider configuration is now explicitly server-only and fail-closed. The adapter requires an approved provider name and a server-side API key before it can be constructed, rejects browser execution, and keeps credentials out of returned objects. The adapter contract also requires a delivery-job idempotency key and a provider message ID for accepted sends. The current adapter still intentionally performs no external send until a real provider implementation is added.

## Stage 30

The provider adapter now has a dedicated HTTPS request boundary with bounded timeouts, redirect rejection, controlled JSON parsing, and classification of retryable HTTP/network failures. Provider credentials remain server-only and are sent only through the authorization header. The adapter sends the delivery-job idempotency key through both the provider payload and the Idempotency-Key header. No provider-specific endpoint is enabled by default.

## Stage 31

Retryable provider failures are now connected to the delivery recovery boundary. Timeouts, network failures, HTTP 408/425/429, and 5xx responses can be classified as retryable and routed back to the existing bounded backoff system. The retry cap remains enforced by the delivery-retry module, while non-retryable provider configuration/response errors are not silently retried.

## Stage 34

Background delivery is now structured around protected worker endpoints. Delivery processing claims bounded batches and stale-job recovery has its own authenticated endpoint. The deployment configuration should invoke these endpoints from a trusted scheduler; the endpoints fail closed without the server-side worker secret. No client-side scheduling or provider credential exposure is used.

## Stage 39 CI dependency note

The project currently declares `pg` in `package.json` but does not commit a generated npm lockfile. CI therefore uses `npm install --ignore-scripts` rather than a fabricated or incomplete lockfile. Before production release, generate and commit a real lockfile with the project's Node/npm toolchain so dependency resolution is reproducible.

## Stage 40 frontend/backend integration audit

- [x] Login uses the backend authentication endpoint with same-origin credentials.
- [x] Dashboard now performs a session check before remaining in the application shell.
- [x] Campaign list redirects unauthenticated users to login.
- [x] Campaign creation/editing requests use CSRF tokens for state-changing operations.
- [x] Email content saves use authenticated, CSRF-protected backend requests.
- [x] Audience and contact mutations use authenticated, CSRF-protected requests.
- [x] Automation loading/saving uses the authenticated backend workflow APIs.
- [x] New campaigns remain drafts until a valid future schedule is explicitly saved.

The browser still never receives provider credentials, and the frontend does not send email directly.
