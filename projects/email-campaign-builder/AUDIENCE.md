# Audience and segmentation boundary

This stage provides a frontend-only audience workflow.

## Included

- Audience group selection
- Segment name and condition
- Safe local demo rendering
- Required-field validation
- Accessible status feedback

## Security boundary

No contact records, email addresses, tracking identifiers, or campaign data are persisted or transmitted by this frontend. New segment labels are rendered with DOM text APIs rather than HTML injection.

Before production, the backend must enforce consent/opt-in rules, tenant and campaign ownership, authorization, input validation, rate limits, privacy requirements, audit controls, and secure data retention. Audience membership must never be trusted from client-side input alone.