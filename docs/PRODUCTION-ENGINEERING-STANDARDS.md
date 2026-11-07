# Production Engineering and Security Standards

This document defines the engineering baseline for every project in this repository. It is a review and implementation standard, not a claim that every control is already deployed.

## 1. Security principles

- Use deny-by-default access control and least privilege for users, services, databases, CI jobs, and deployment credentials.
- Store passwords only as salted, adaptive password hashes (prefer Argon2id; use suitably configured bcrypt where compatibility requires it). Never encrypt passwords for later recovery or log credentials.
- Use short-lived, rotated sessions in HttpOnly, Secure, appropriately configured SameSite cookies. Rotate session identifiers after authentication and privilege changes; invalidate sessions on logout and credential reset.
- Enforce authorization on the server for every protected resource and object. Hiding a UI control is not authorization.
- Validate and normalize untrusted input at trust boundaries. Use parameterized database queries and context-aware output encoding.
- Protect state-changing browser requests against CSRF. Apply strict CORS allowlists; CORS is not authentication.
- Apply per-user and per-IP rate limits, request-size limits, timeouts, and abuse controls to public endpoints.
- Treat user-supplied URLs as SSRF risks. Restrict schemes, destinations, redirects, DNS/IP ranges, and outbound network access where server-side fetching exists.
- Validate uploaded files by size, type, content signature, storage location, and access policy. Do not trust filenames or browser-provided MIME types.
- Keep secrets out of source control, client bundles, logs, screenshots, and error messages. Use deployment secret stores and rotate exposed credentials immediately.
- Set a restrictive Content Security Policy and appropriate browser security headers at the hosting layer where supported. Avoid broad wildcards and unsafe inline script allowances without documented justification.
- Keep dependencies and build actions updated; review lockfiles and security advisories. Pin high-trust CI actions to verified commit SHAs where practical.
- Backups must be access-controlled, encrypted, monitored, and periodically restore-tested.

## 2. Project architecture

Choose the simplest architecture that meets verified requirements. Do not add Redis, queues, microservices, Kubernetes, WebSockets, vector databases, or model fine-tuning merely to claim technology coverage.

Use these only when the workload justifies them:
- Redis: shared cache, distributed rate limiting, or ephemeral coordination with explicit TTL and failure behavior.
- Queues/background workers: slow, retryable, or scheduled tasks; use idempotency keys, bounded retries, dead-letter handling, and observability.
- WebSockets: genuine bidirectional real-time requirements, with authenticated connections and per-message authorization.
- Microservices/load balancing/Kubernetes: independently scaling/deploying services and operational capacity to run them.
- Vector databases/AI agents/MCP: a defined retrieval or tool-use requirement, strict tool permissions, tenant isolation, data minimization, and auditable calls.
- Fine-tuning: only after evaluation shows prompting/retrieval is insufficient and a lawful, quality-controlled dataset exists.

## 3. Quality gates

Each project should have an appropriate subset of:
- Formatting, linting, type checking, and reproducible builds.
- Unit tests for validation and business logic.
- Integration tests for APIs, persistence, and authorization boundaries.
- End-to-end tests for critical user journeys and responsive layouts.
- Regression tests for every fixed defect.
- Dependency, secret, static-analysis, and configuration scanning.
- Performance checks for critical pages and endpoints.
- Accessibility checks, keyboard navigation, and semantic HTML review.
- Deployment smoke tests and rollback/recovery procedures.

A passing static scan does not prove runtime security. Test allowed and denied access paths, malformed inputs, expired sessions, rate-limit behavior, and failure modes.

## 4. Project-specific application

- Static portfolio and demos: no unnecessary authentication; protect forms and external integrations, minimize third-party scripts, validate input, apply hosting-supported headers, and test accessibility/performance.
- Student and resource applications: enforce server-side ownership/role checks, data validation, safe file handling, privacy-conscious retention, and database constraints.
- Email/campaign systems: protect contact data, verify provider webhooks, prevent replay, enforce consent/suppression rules, use idempotent delivery jobs, and restrict sending privileges.
- PDF/file tools: enforce upload limits, safe parsing boundaries, resource/time limits, and avoid exposing local paths or internal network resources.
- AI projects: keep provider keys server-side, constrain tools and outbound requests, validate model output before actions, isolate user data, and apply usage budgets.

## 5. Definition of done

A change is complete only when:
1. The relevant code and threat model have been reviewed.
2. Tests cover intended behavior and important negative cases.
3. CI checks pass, or failures are clearly documented and resolved before merge.
4. Deployment behavior is verified in the target environment when deployment is in scope.
5. Documentation and operational configuration are updated.
6. No credentials or private user data are exposed.

Never describe a system as unhackable or claim a security control is verified without evidence. Record residual risks and follow-up work explicitly.
