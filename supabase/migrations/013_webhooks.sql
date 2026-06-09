CREATE TABLE IF NOT EXISTS webhooks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url         TEXT NOT NULL,
  secret      TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  events      TEXT[] NOT NULL DEFAULT '{}',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  label       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all ON webhooks FOR ALL TO service_role USING (true);
