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
8. Production email-provider integration
9. Security hardening and deployment verification

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