-- Stage 21: campaign automation persistence
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL DEFAULT 'Campaign workflow',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT automation_workflows_status_chk CHECK (status IN ('draft','active','paused'))
);
CREATE TABLE IF NOT EXISTS automation_steps (
  id UUID PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES automation_workflows(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL CHECK (step_order > 0 AND step_order <= 100),
  trigger_type VARCHAR(60) NOT NULL,
  delay_type VARCHAR(30) NOT NULL,
  action_type VARCHAR(60) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workflow_id, step_order)
);
CREATE INDEX IF NOT EXISTS automation_workflows_user_idx ON automation_workflows(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS automation_steps_workflow_idx ON automation_steps(workflow_id,step_order);
