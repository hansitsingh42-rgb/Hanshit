-- Stage 48: database integrity hardening.
-- Constraints are added NOT VALID so existing deployments are not blocked by
-- legacy rows; new and updated rows are enforced immediately.
ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_status_chk
  CHECK (status IN ('draft','scheduled','cancelled'))
  NOT VALID;

ALTER TABLE login_attempts
  ADD CONSTRAINT login_attempts_nonnegative_chk
  CHECK (attempts >= 0)
  NOT VALID;

ALTER TABLE sessions
  ADD CONSTRAINT sessions_expiry_after_creation_chk
  CHECK (expires_at > created_at)
  NOT VALID;

CREATE INDEX IF NOT EXISTS campaigns_user_status_idx
  ON campaigns(user_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS audience_segment_contacts_segment_idx
  ON audience_segment_contacts(segment_id, contact_id);
