export type BrandTheme = {
  accent: string; accentH: string; accentDim: string
  bg: string; surface: string; border: string
  mood: 'dark' | 'ultra-dark' | 'deep'
  heroStyle: 'cinematic' | 'horror' | 'minimal' | 'clinical' | 'epic' | 'mystical' | 'tech' | 'warm'
  fontWeight: 'bold' | 'black' | 'extrabold'
  tagline: string; aiTone: string
  niches: string[]; nicheLabels: Record<string, string>
}

export type Brand = {
  id: string; name: string; slug: string
  description: string | null
  theme_config: BrandTheme
  is_active: boolean
  created_at: string; updated_at: string
}
