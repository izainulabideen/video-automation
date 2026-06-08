-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  theme_config JSONB NOT NULL DEFAULT '{}',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link scenarios to brands
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;

-- Seed the Finance brand (preserves all existing scenarios)
INSERT INTO brands (id, name, slug, description, theme_config) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Finance',
  'finance',
  'Premium finance & investing education',
  '{
    "accent": "#C8922A",
    "accentH": "#E8B84B",
    "accentDim": "#92400e",
    "bg": "#06080F",
    "surface": "#0D1117",
    "border": "rgba(200,146,42,0.15)",
    "mood": "dark",
    "heroStyle": "cinematic",
    "fontWeight": "black",
    "tagline": "Finance · Education",
    "aiTone": "authoritative, urgent, data-driven, educational",
    "niches": ["tax", "investing", "budgeting", "real_estate", "crypto", "business", "insurance", "retirement"],
    "nicheLabels": {
      "tax": "Tax Strategy",
      "investing": "Investing",
      "budgeting": "Budgeting",
      "real_estate": "Real Estate",
      "crypto": "Crypto",
      "business": "Business",
      "insurance": "Insurance",
      "retirement": "Retirement"
    }
  }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Assign all existing scenarios to Finance brand
UPDATE scenarios SET brand_id = 'a0000000-0000-0000-0000-000000000001' WHERE brand_id IS NULL;
