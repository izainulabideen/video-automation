-- Phase 1: checklist items + activity log + cover graphic

-- Checklist items per scenario
CREATE TABLE IF NOT EXISTS checklist_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id  UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  label        TEXT NOT NULL,
  is_done      BOOLEAN NOT NULL DEFAULT false,
  done_by      TEXT,
  done_at      TIMESTAMPTZ,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS checklist_items_scenario_id_idx ON checklist_items(scenario_id);

-- Activity log per scenario
CREATE TABLE IF NOT EXISTS activity_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id  UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  user_name    TEXT NOT NULL,
  action       TEXT NOT NULL,
  details      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS activity_logs_scenario_id_idx ON activity_logs(scenario_id);

-- Cover graphic on scenarios
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS cover_graphic_id UUID REFERENCES graphics(id) ON DELETE SET NULL;

-- Sort order on graphics (already exists, ensure index)
CREATE INDEX IF NOT EXISTS graphics_sort_order_idx ON graphics(scenario_id, sort_order);
