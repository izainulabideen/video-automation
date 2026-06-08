export type BrandTheme = {
  accent:     string   // primary color  e.g. "#C8922A"
  accentH:    string   // lighter/hover variant
  accentDim:  string   // darker/muted variant
  bg:         string   // page background
  surface:    string   // card/panel background
  border:     string   // default border color (rgba)
  mood:       'dark' | 'ultra-dark' | 'deep'
  heroStyle:  'cinematic' | 'horror' | 'minimal' | 'clinical' | 'epic' | 'mystical' | 'tech' | 'warm'
  fontWeight: 'bold' | 'black' | 'extrabold'
  tagline:    string
  aiTone:     string
  niches:     string[]
  nicheLabels: Record<string, string>
}

export type Brand = {
  id:           string
  name:         string
  slug:         string
  description:  string | null
  theme_config: BrandTheme
  is_active:    boolean
  created_at:   string
  updated_at:   string
}
