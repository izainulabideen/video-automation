export const AI_TOOL_SUGGESTIONS = [
  'Midjourney', 'DALL-E 3', 'ChatGPT', 'Grok', 'Sora', 'Runway',
  'Kling', 'Pika', 'Stable Diffusion', 'Ideogram', 'Flux', 'Luma',
] as const

export const SCENE_TYPES = [
  { value: 'money_drain',    label: 'Money Drain / Black Hole' },
  { value: 'legal_document', label: 'Legal Document / Scroll' },
  { value: 'vault',          label: 'Vault / Safe' },
  { value: 'building',       label: 'Building / Mansion' },
  { value: 'chart',          label: 'Chart / Graph' },
  { value: 'warning',        label: 'Warning / Alert' },
  { value: 'padlock',        label: 'Padlock / Security' },
  { value: 'money_bag',      label: 'Money Bag / Stack' },
  { value: 'flow_diagram',   label: 'Flow / Process Diagram' },
  { value: 'clock',          label: 'Time / Deadline' },
  { value: 'percentage',     label: 'Percentage / Pie Cut' },
  { value: 'asset_cluster',  label: 'Asset Cluster' },
] as const

export const PALETTES = [
  { value: 'steel_blue',    label: 'Steel Blue',     bg: '#B8C9D9', accent: '#EFD9B4', use: 'Wealth destruction, tax traps' },
  { value: 'midnight_gold', label: 'Midnight Gold',  bg: '#1A1A2E', accent: '#F5C842', use: 'Elite secrets, trusts' },
  { value: 'cream_forest',  label: 'Cream & Forest', bg: '#F5F0E8', accent: '#2D6A4F', use: 'Wealth building, investing' },
  { value: 'warm_amber',    label: 'Warm Amber',     bg: '#FFF3E0', accent: '#E65100', use: 'Debt traps, bad habits' },
  { value: 'ice_blue',      label: 'Ice Blue',       bg: '#E8F4F8', accent: '#1565C0', use: 'Legal, technical finance' },
  { value: 'lavender',      label: 'Lavender',       bg: '#F0EBF8', accent: '#6A1B9A', use: 'Wealth psychology' },
] as const

export const NICHES = [
  'wealth_secrets', 'career_money', 'money_psychology',
  'tech_careers', 'wall_street', 'legal_finance',
  'real_estate', 'investing', 'tax_strategy', 'other',
] as const

export const NICHE_LABELS: Record<string, string> = {
  wealth_secrets:    'Wealth Secrets',
  career_money:      'Career & Money',
  money_psychology:  'Money Psychology',
  tech_careers:      'Tech Careers',
  wall_street:       'Wall Street',
  legal_finance:     'Legal Finance',
  real_estate:       'Real Estate',
  investing:         'Investing',
  tax_strategy:      'Tax Strategy',
  other:             'Other',
}

export const STATUS_OPTIONS = [
  { value: 'draft',         label: 'Draft' },
  { value: 'in_production', label: 'In Production' },
  { value: 'published',     label: 'Published' },
] as const

export const VIDEO_STATUS_OPTIONS = [
  { value: 'editing',   label: 'Editing' },
  { value: 'exported',  label: 'Exported' },
  { value: 'published', label: 'Published' },
] as const
