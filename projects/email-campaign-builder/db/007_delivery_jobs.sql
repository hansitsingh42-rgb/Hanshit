CREATE TABLE IF NOT EXISTS delivery_jobs (
  id UUID PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES audience_contacts(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','sent','failed','cancelled')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 10),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processing_started_at TIMESTAMPTZ,
  provider_message_id VARCHAR(200),
  provider_idempotency_key VARCHAR(200),
  last_error_code VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, contact_id)
);
CREATE INDEX IF NOT EXISTS delivery_jobs_ready_idx ON delivery_jobs(status, available_at);
CREATE INDEX IF NOT EXISTS delivery_jobs_campaign_idx ON delivery_jobs(campaign_id, status);

CREATE INDEX IF NOT EXISTS delivery_jobs_processing_idx ON delivery_jobs(status, processing_started_at);
CREATE UNIQUE INDEX IF NOT EXISTS delivery_jobs_provider_idempotency_idx ON delivery_jobs(provider_idempotency_key) WHERE provider_idempotency_key IS NOT NULL;
