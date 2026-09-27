-- Stage 63: authentication/session database hardening.
-- Stage 48 integrity constraints remain below.
CREATE INDEX IF NOT EXISTS sessions_token_expires_idx ON sessions(token_hash, expires_at);
CREATE INDEX IF NOT EXISTS login_attempts_blocked_until_idx ON login_attempts(blocked_until) WHERE blocked_until IS NOT NULL;

-- Stage 48 integrity constraints. Guarded so the migration is safely re-runnable.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='campaigns_status_chk') THEN
    ALTER TABLE campaigns
      ADD CONSTRAINT campaigns_status_chk
      CHECK (status IN ('draft','scheduled','cancelled'))
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='login_attempts_nonnegative_chk') THEN
    ALTER TABLE login_attempts
      ADD CONSTRAINT login_attempts_nonnegative_chk
      CHECK (attempts >= 0)
      NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='sessions_expiry_after_creation_chk') THEN
    ALTER TABLE sessions
      ADD CONSTRAINT sessions_expiry_after_creation_chk
      CHECK (expires_at > created_at)
      NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS campaigns_user_status_idx
  ON campaigns(user_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS audience_segment_contacts_segment_idx
  ON audience_segment_contacts(segment_id, contact_id);

-- Stage 68: enforce one automation workflow per campaign/user.
CREATE UNIQUE INDEX IF NOT EXISTS automation_workflows_campaign_user_uq
  ON automation_workflows(campaign_id, user_id);
