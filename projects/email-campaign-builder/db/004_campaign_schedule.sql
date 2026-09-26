-- Stage 20: campaign scheduling and lifecycle
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS campaigns_scheduled_idx
  ON campaigns(status, scheduled_at)
  WHERE scheduled_at IS NOT NULL;
