-- Script version history
CREATE TABLE IF NOT EXISTS script_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  word_count  INT,
  saved_by    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS script_versions_scenario_id_idx ON script_versions(scenario_id, created_at DESC);
