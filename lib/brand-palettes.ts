export interface BrandPalette {
  value: string
  label: string
  bg: string
  accent: string
  use: string
}

/** Palettes keyed by brand slug. Falls back to finance if slug not found. */
export const BRAND_PALETTES: Record<string, BrandPalette[]> = {
  finance: [
    { value: 'steel_blue',    label: 'Steel Blue',     bg: '#B8C9D9', accent: '#EFD9B4', use: 'Wealth destruction, tax traps' },
    { value: 'midnight_gold', label: 'Midnight Gold',  bg: '#1A1A2E', accent: '#F5C842', use: 'Elite secrets, trusts' },
    { value: 'cream_forest',  label: 'Cream & Forest', bg: '#F5F0E8', accent: '#2D6A4F', use: 'Wealth building, investing' },
    { value: 'warm_amber',    label: 'Warm Amber',     bg: '#FFF3E0', accent: '#E65100', use: 'Debt traps, bad habits' },
    { value: 'ice_blue',      label: 'Ice Blue',       bg: '#E8F4F8', accent: '#1565C0', use: 'Legal, technical finance' },
    { value: 'lavender',      label: 'Lavender',       bg: '#F0EBF8', accent: '#6A1B9A', use: 'Wealth psychology' },
  ],

  horror: [
    { value: 'blood_night',   label: 'Blood Night',    bg: '#0D0000', accent: '#CC0000', use: 'Gore, violence, fear' },
    { value: 'crimson_dusk',  label: 'Crimson Dusk',   bg: '#1A0505', accent: '#9B1C1C', use: 'Supernatural, dread' },
    { value: 'void_purple',   label: 'Void Purple',    bg: '#0C001A', accent: '#7C3AED', use: 'Psychological horror' },
    { value: 'toxic_green',   label: 'Toxic Green',    bg: '#001A00', accent: '#22C55E', use: 'Body horror, mutation' },
    { value: 'ash_grey',      label: 'Ash Grey',       bg: '#111111', accent: '#A0A0A0', use: 'Slow burn, despair' },
  ],

  philosophy: [
    { value: 'deep_marble',   label: 'Deep Marble',    bg: '#1C1C1E', accent: '#E8D5B7', use: 'Ancient wisdom, Stoicism' },
    { value: 'ivory_ink',     label: 'Ivory Ink',      bg: '#FAF7F0', accent: '#3D2B1F', use: 'Enlightenment, reason' },
    { value: 'cobalt_parch',  label: 'Cobalt & Parch', bg: '#F5F0E8', accent: '#1B4B8A', use: 'Logic, argument' },
    { value: 'ink_night',     label: 'Ink Night',      bg: '#0A0A12', accent: '#C9B99A', use: 'Existentialism, void' },
    { value: 'sage_stone',    label: 'Sage & Stone',   bg: '#E8EDE4', accent: '#4A5568', use: 'Ethics, morality' },
  ],

  psychology: [
    { value: 'mind_violet',    label: 'Mind Violet',    bg: '#1E1B2E', accent: '#A78BFA', use: 'Cognitive bias, subconscious' },
    { value: 'clinical_white', label: 'Clinical White', bg: '#F8F8F8', accent: '#2563EB', use: 'Research, evidence' },
    { value: 'warm_coral',     label: 'Warm Coral',     bg: '#FFF5F5', accent: '#E11D48', use: 'Emotion, trauma' },
    { value: 'forest_calm',    label: 'Forest Calm',    bg: '#E8F0E8', accent: '#166534', use: 'Healing, growth' },
    { value: 'dark_neuron',    label: 'Dark Neuron',    bg: '#0F0F1A', accent: '#60A5FA', use: 'Brain science, neuroplasticity' },
  ],

  'true-crime': [
    { value: 'case_file',     label: 'Case File',      bg: '#F5F0E8', accent: '#7C2D12', use: 'Documentary, evidence' },
    { value: 'interrogation', label: 'Interrogation',  bg: '#111111', accent: '#F59E0B', use: 'Thriller, tension' },
    { value: 'police_blue',   label: 'Police Blue',    bg: '#0A1628', accent: '#3B82F6', use: 'Law enforcement, justice' },
    { value: 'red_thread',    label: 'Red Thread',     bg: '#1A0A0A', accent: '#EF4444', use: 'Serial killer, obsession' },
    { value: 'newspaper',     label: 'Newspaper',      bg: '#F0EBD8', accent: '#1C1C1C', use: 'Cold case, archive' },
  ],

  history: [
    { value: 'aged_parchment', label: 'Aged Parchment', bg: '#F5EDD0', accent: '#92400E', use: 'Ancient civilizations' },
    { value: 'empire_crimson', label: 'Empire Crimson', bg: '#1A0A0A', accent: '#DC2626', use: 'War, conquest, empire' },
    { value: 'manuscript',     label: 'Manuscript',     bg: '#EDE0C8', accent: '#44403C', use: 'Medieval, religious history' },
    { value: 'colonial_navy',  label: 'Colonial Navy',  bg: '#0A1628', accent: '#FBBF24', use: 'Colonial era, exploration' },
    { value: 'stone_grey',     label: 'Stone Grey',     bg: '#D1D5DB', accent: '#374151', use: 'Architecture, monuments' },
  ],

  science: [
    { value: 'cosmic_dark',   label: 'Cosmic Dark',    bg: '#04080F', accent: '#60A5FA', use: 'Space, astronomy' },
    { value: 'lab_white',     label: 'Lab White',      bg: '#F8FAFC', accent: '#0EA5E9', use: 'Research, experiments' },
    { value: 'neon_circuit',  label: 'Neon Circuit',   bg: '#0F0F0F', accent: '#34D399', use: 'Technology, biology' },
    { value: 'spectrum',      label: 'Spectrum',       bg: '#0A0020', accent: '#C084FC', use: 'Physics, quantum' },
    { value: 'ocean_deep',    label: 'Ocean Deep',     bg: '#0C1E2E', accent: '#22D3EE', use: 'Marine, geology' },
  ],

  mythology: [
    { value: 'golden_realm',    label: 'Golden Realm',   bg: '#1A0F00', accent: '#F59E0B', use: 'Greek, Norse gods' },
    { value: 'jade_mystical',   label: 'Jade Mystical',  bg: '#001A0F', accent: '#10B981', use: 'Asian mythology' },
    { value: 'lapis_sacred',    label: 'Lapis Sacred',   bg: '#000A2E', accent: '#818CF8', use: 'Egyptian, cosmic' },
    { value: 'blood_sacrifice', label: 'Blood Sacrifice', bg: '#1A0000', accent: '#F87171', use: 'Aztec, dark rites' },
    { value: 'mist_lore',       label: 'Mist & Lore',    bg: '#EEF2F8', accent: '#6366F1', use: 'Celtic, fairy tales' },
  ],

  'self-improvement': [
    { value: 'sunrise_grow', label: 'Sunrise Growth', bg: '#FFF8F0', accent: '#F97316', use: 'Morning routine, habits' },
    { value: 'forest_zen',   label: 'Forest Zen',     bg: '#F0F7EE', accent: '#16A34A', use: 'Mindfulness, meditation' },
    { value: 'slate_focus',  label: 'Slate Focus',    bg: '#1E293B', accent: '#F1F5F9', use: 'Discipline, productivity' },
    { value: 'warm_bronze',  label: 'Warm Bronze',    bg: '#FDF4E7', accent: '#D97706', use: 'Achievement, motivation' },
    { value: 'sky_clarity',  label: 'Sky Clarity',    bg: '#F0F9FF', accent: '#0284C7', use: 'Mental health, clarity' },
  ],

  technology: [
    { value: 'matrix_dark',  label: 'Matrix Dark',  bg: '#050F05', accent: '#4ADE80', use: 'Hacking, code, AI' },
    { value: 'cyber_blue',   label: 'Cyber Blue',   bg: '#020B18', accent: '#38BDF8', use: 'Future tech, robots' },
    { value: 'minimal_tech', label: 'Minimal Tech', bg: '#F8FAFC', accent: '#1E293B', use: 'Product, design' },
    { value: 'neon_purple',  label: 'Neon Purple',  bg: '#0D0015', accent: '#A855F7', use: 'Crypto, web3, metaverse' },
    { value: 'terminal',     label: 'Terminal',     bg: '#0C0C0C', accent: '#FB923C', use: 'Dev culture, startups' },
  ],
}

/** Returns palettes for a given brand slug or niche, falling back to finance */
export function getPalettesForBrand(slug?: string | null): BrandPalette[] {
  const fallback = BRAND_PALETTES.finance as BrandPalette[]
  if (!slug) return fallback
  const direct = BRAND_PALETTES[slug]
  if (direct) return direct
  const normalised = slug.toLowerCase().replace(/_/g, '-')
  return BRAND_PALETTES[normalised] ?? fallback
}
