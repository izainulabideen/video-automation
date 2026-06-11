CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id   UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event        TEXT NOT NULL,
  url          TEXT NOT NULL,
  payload      JSONB,
  status_code  INT,
  success      BOOLEAN NOT NULL DEFAULT false,
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id, created_at DESC);
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all ON webhook_deliveries FOR ALL TO service_role USING (true);
