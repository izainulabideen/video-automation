-- Separate table to manage what each scenario shows publicly
-- Allows fine-grained control: show script publicly but not graphics, etc.
CREATE TABLE IF NOT EXISTS public_settings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id       UUID UNIQUE REFERENCES scenarios(id) ON DELETE CASCADE,
  is_public         BOOLEAN NOT NULL DEFAULT false,
  show_script       BOOLEAN NOT NULL DEFAULT true,
  show_graphics     BOOLEAN NOT NULL DEFAULT true,
  show_video        BOOLEAN NOT NULL DEFAULT true,
  show_platform_links BOOLEAN NOT NULL DEFAULT true,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by        TEXT
);

ALTER TABLE public_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all ON public_settings FOR ALL TO service_role USING (true);

CREATE INDEX idx_public_settings_scenario ON public_settings(scenario_id);
CREATE INDEX idx_public_settings_is_public ON public_settings(is_public) WHERE is_public = true;

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_public_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_public_settings_updated_at
  BEFORE UPDATE ON public_settings
  FOR EACH ROW EXECUTE FUNCTION update_public_settings_timestamp();

-- Remove is_public from scenarios (now managed via public_settings)
-- Run migration 004 first, then this one replaces it
ALTER TABLE scenarios DROP COLUMN IF EXISTS is_public;
