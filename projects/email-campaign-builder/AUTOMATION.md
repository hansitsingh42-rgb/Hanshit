# Automation workflow boundary

This stage is a frontend workflow builder for the email campaign product.

## Included

- Trigger selection
- Delay selection
- Campaign action selection
- Ordered workflow preview
- Client-side required-field validation

## Production boundary

No automation is scheduled and no email is sent by this frontend. Workflow state is intentionally not persisted or transmitted.

Before production, the backend must validate every workflow step, enforce tenant/campaign ownership, prevent unauthorized trigger execution, rate-limit job creation, use an idempotent job system, protect provider credentials, and maintain auditable delivery state without exposing secrets or unnecessary message content.