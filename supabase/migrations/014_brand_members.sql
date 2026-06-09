-- Per-brand user access control
CREATE TABLE IF NOT EXISTS brand_members (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id   UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(brand_id, user_id)
);
ALTER TABLE brand_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all ON brand_members FOR ALL TO service_role USING (true);
CREATE INDEX idx_brand_members_brand ON brand_members(brand_id);
CREATE INDEX idx_brand_members_user  ON brand_members(user_id);
