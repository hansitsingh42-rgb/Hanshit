# Analytics boundary

Analytics UI is currently demo-only.

## Included

- Delivery metric cards
- Open rate
- Click rate
- Bounce rate
- Responsive engagement visualization placeholder

## Production security and privacy

Analytics must be derived from authenticated server-side records. Never trust client-submitted metric totals. Protect campaign and tenant authorization, minimize personal data, define retention rules, restrict access to analytics endpoints, rate-limit requests, and avoid exposing recipient-level tracking data unless the product has a documented lawful basis and appropriate controls.

Provider webhooks must be authenticated and verified before updating delivery state. Secrets and provider credentials remain server-side.