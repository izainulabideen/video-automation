-- Add media_type and duration_sec to graphics table
-- media_type: 'image' (default) or 'clip' (short video clip)
ALTER TABLE graphics
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS clip_duration_sec NUMERIC(6,2);
