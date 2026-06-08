-- Add is_public flag to scenarios
-- Controls whether a scenario appears on the public /watch pages
-- Default false — must be explicitly enabled per scenario
ALTER TABLE scenarios
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
