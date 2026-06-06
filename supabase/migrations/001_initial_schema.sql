-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SCENARIOS
CREATE TABLE scenarios (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  niche       TEXT NOT NULL,
  hook        TEXT NOT NULL,
  audience    TEXT,
  emotion     TEXT,
  palette     TEXT,
  status      TEXT NOT NULL DEFAULT 'draft',
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROMPTS
CREATE TABLE prompts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id   UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  scene_type    TEXT NOT NULL,
  caption_word  TEXT,
  prompt_text   TEXT NOT NULL,
  ai_tool       TEXT NOT NULL DEFAULT 'midjourney',
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SCRIPTS
CREATE TABLE scripts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id   UUID UNIQUE REFERENCES scenarios(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  word_count    INT GENERATED ALWAYS AS (array_length(string_to_array(trim(body),' '),1)) STORED,
  duration_sec  INT,
  voice_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GRAPHICS
CREATE TABLE graphics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id   UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  prompt_id     UUID REFERENCES prompts(id) ON DELETE SET NULL,
  file_url      TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size_kb  INT,
  scene_type    TEXT,
  caption_word  TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VIDEOS
CREATE TABLE videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id   UUID UNIQUE REFERENCES scenarios(id) ON DELETE CASCADE,
  file_url      TEXT,
  platform_urls JSONB,
  duration_sec  INT,
  status        TEXT NOT NULL DEFAULT 'editing',
  publish_date  DATE,
  performance   JSONB,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TAGS
CREATE TABLE tags (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name  TEXT UNIQUE NOT NULL
);

CREATE TABLE scenario_tags (
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  tag_id      UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (scenario_id, tag_id)
);

-- AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scenarios_updated BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER scripts_updated BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER videos_updated BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE scenarios     ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphics      ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY auth_all ON scenarios     FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all ON prompts       FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all ON scripts       FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all ON graphics      FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all ON videos        FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all ON tags          FOR ALL TO authenticated USING (true);
CREATE POLICY auth_all ON scenario_tags FOR ALL TO authenticated USING (true);

-- INDEXES
CREATE INDEX idx_prompts_scenario   ON prompts(scenario_id);
CREATE INDEX idx_graphics_scenario  ON graphics(scenario_id);
CREATE INDEX idx_scenarios_status   ON scenarios(status);
CREATE INDEX idx_scenarios_created  ON scenarios(created_at DESC);
