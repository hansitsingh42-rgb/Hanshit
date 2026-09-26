CREATE TABLE IF NOT EXISTS provider_webhook_events (
  event_id VARCHAR(200) PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS provider_webhook_events_received_idx
  ON provider_webhook_events(received_at);
