CREATE TABLE IF NOT EXISTS audience_segments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  source VARCHAR(80) NOT NULL,
  condition VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS audience_segments_user_created_idx
  ON audience_segments(user_id, created_at DESC);

ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS audience_segment_id UUID REFERENCES audience_segments(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS campaigns_audience_segment_idx
  ON campaigns(audience_segment_id);
