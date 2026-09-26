# Production email provider integration

This repository currently contains a safe frontend boundary only. It does not connect to an email provider.

## Required production architecture

- Provider credentials live only in server-side environment variables or a managed secret store.
- The browser never receives provider API keys, SMTP passwords, webhook secrets, or access tokens.
- Backend endpoints authenticate the user and authorize campaign ownership before sending.
- Server-side validation checks sender identity, recipients, campaign state, content limits, and provider constraints.
- Sending jobs are queued and idempotent to prevent accidental duplicate delivery.
- Provider webhooks are authenticated and signature-verified before delivery/engagement records change.
- Rate limits, quotas, bounce handling, suppression lists, unsubscribe state, and retry policies are enforced server-side.
- Logs must not contain credentials, authorization headers, or unnecessary recipient/message content.

## Current state

Provider status is intentionally shown as **Not connected**. No credentials are requested by the frontend and no production email is sent.