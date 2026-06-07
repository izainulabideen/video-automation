-- USERS TABLE
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'member', -- admin | member
  is_active     BOOLEAN NOT NULL DEFAULT true,
  invited_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RESET TOKENS
CREATE TABLE password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVITE TOKENS
CREATE TABLE invite_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'member',
  token_hash TEXT NOT NULL,
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_users_email              ON users(email);
CREATE INDEX idx_reset_tokens_user        ON password_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_hash        ON password_reset_tokens(token_hash);
CREATE INDEX idx_invite_tokens_email      ON invite_tokens(email);

-- RLS
ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens  ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_tokens          ENABLE ROW LEVEL SECURITY;

-- Service role bypass (server uses service role key for user management)
CREATE POLICY service_all ON users                 FOR ALL TO service_role USING (true);
CREATE POLICY service_all ON password_reset_tokens FOR ALL TO service_role USING (true);
CREATE POLICY service_all ON invite_tokens         FOR ALL TO service_role USING (true);
