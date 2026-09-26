CREATE TABLE IF NOT EXISTS audience_contacts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(320) NOT NULL,
  name VARCHAR(120),
  status VARCHAR(20) NOT NULL DEFAULT 'subscribed'
    CHECK (status IN ('subscribed','unsubscribed','suppressed')),
  consent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, email)
);

CREATE INDEX IF NOT EXISTS audience_contacts_user_status_idx
  ON audience_contacts(user_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS audience_segment_contacts (
  segment_id UUID NOT NULL REFERENCES audience_segments(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES audience_contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(segment_id, contact_id)
);

CREATE INDEX IF NOT EXISTS audience_segment_contacts_contact_idx
  ON audience_segment_contacts(contact_id);
