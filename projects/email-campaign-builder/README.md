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
