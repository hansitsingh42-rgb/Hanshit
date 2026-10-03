# Product workflow

The project purpose remains an email campaign builder, with the frontend experience and server-side foundation developed as separate boundaries.

## Current sequence

1. Landing page and product shell
2. Authentication
3. Campaign creation and editing
4. Audience and segmentation
5. Automation
6. Analytics and campaign state
7. Delivery preparation/processing boundary
8. Provider webhook handling
9. Security and deployment verification

## Architecture boundary

The browser handles presentation and user interaction. Server-side API modules handle authentication, authorization, validation, persistence, delivery controls and provider integration.

The frontend does not receive provider credentials and does not send email directly.

## Current status

Campaign persistence, authenticated workflows, delivery controls and security primitives are implemented in the repository. Real provider delivery remains intentionally disabled until production gates are verified in a controlled environment.

## Verification rule

A feature is considered complete only when the affected code, automated checks, security implications, and deployment path have been reviewed together.
