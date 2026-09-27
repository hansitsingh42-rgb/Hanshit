# Privacy and data-handling baseline

## Contact data

- Contact email addresses are tenant-scoped by `user_id`.
- Consent time is recorded in `consent_at`.
- Contacts can be unsubscribed or suppressed.
- Bounce and unsubscribe webhook events prevent future delivery to the affected contact.
- Email addresses and message content must not be written to application logs.

## Retention

- Delivery and webhook records should have an explicit retention period chosen by the operator based on legal, contractual, support, and product requirements.
- Retention deletion must run as a controlled maintenance job, not during ordinary user requests.
- The database includes indexes that support future retention queries without exposing additional contact data.

## Production requirements

- Provide an authenticated export/delete workflow if required by the applicable privacy requirements.
- Restrict database access with least privilege.
- Encrypt data in transit and use managed encryption at rest where available.
- Keep provider webhook payload storage minimal; this project stores only replay-protection event IDs.
- Do not send provider credentials, contact lists, or email bodies to the browser unless strictly required by the product contract.
