-- Phase 3: Collaboration — comments, reactions, assignments

-- Comments on scenarios
CREATE TABLE IF NOT EXISTS scenario_comments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id  UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  parent_id    UUID REFERENCES scenario_comments(id) ON DELETE CASCADE,
  user_name    TEXT NOT NULL,
  user_email   TEXT,
  body         TEXT NOT NULL,
  is_resolved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS scenario_comments_scenario_id_idx ON scenario_comments(scenario_id, created_at DESC);

-- Reactions on comments (emoji reactions)
CREATE TABLE IF NOT EXISTS comment_reactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  UUID NOT NULL REFERENCES scenario_comments(id) ON DELETE CASCADE,
  user_name   TEXT NOT NULL,
  emoji       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_name, emoji)
);

-- Scenario assignments
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS due_date DATE;
