-- Privacy/retention foundation.
-- Destructive retention must be scheduled by the deployment operator after
-- confirming the product's legal, contractual, and support requirements.
-- Do not run automatically from application requests.
CREATE INDEX IF NOT EXISTS provider_webhook_events_received_at_idx
  ON provider_webhook_events(received_at);

CREATE INDEX IF NOT EXISTS audience_contacts_consent_idx
  ON audience_contacts(user_id, consent_at);
