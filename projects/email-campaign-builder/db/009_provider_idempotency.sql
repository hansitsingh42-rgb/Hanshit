ALTER TABLE delivery_jobs
  ADD COLUMN IF NOT EXISTS provider_idempotency_key VARCHAR(200);

CREATE UNIQUE INDEX IF NOT EXISTS delivery_jobs_provider_idempotency_idx
  ON delivery_jobs(provider_idempotency_key)
  WHERE provider_idempotency_key IS NOT NULL;
