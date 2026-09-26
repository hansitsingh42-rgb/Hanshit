-- Stage 12: campaign persistence
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  subject_line VARCHAR(180) NOT NULL,
  audience VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaigns_user_updated_idx
  ON campaigns(user_id, updated_at DESC);
