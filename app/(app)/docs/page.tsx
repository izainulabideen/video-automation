import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Clapperboard, Layers, Users, Globe, Webhook, Wand2, Video, Image, FileText, Settings, HelpCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Docs' }

const sections = [
  {
    slug: 'overview',
    icon: BookOpen,
    title: 'Platform Overview',
    description: 'What Veank Studio is, how it\'s structured, and the end-to-end workflow from idea to published video.',
    color: '#C8922A',
  },
  {
    slug: 'scenarios',
    icon: Clapperboard,
    title: 'Scenarios',
    description: 'The core unit of work. Create, manage, assign, and publish video scenarios across brands and niches.',
    color: '#6366F1',
  },
  {
    slug: 'scripts',
    icon: FileText,
    title: 'Scripts',
    description: 'Write, version, and AI-generate full video scripts. Understand scene types and the script editor.',
    color: '#10B981',
  },
  {
    slug: 'prompts',
    icon: Wand2,
    title: 'AI Prompts',
    description: 'Generate and manage Midjourney/DALL-E prompts for each visual scene. One prompt per scene.',
    color: '#F59E0B',
  },
  {
    slug: 'graphics',
    icon: Image,
    title: 'Graphics & Storyboard',
    description: 'Upload rendered frames, reorder them, and view the visual storyboard lightbox on the public page.',
    color: '#EC4899',
  },
  {
    slug: 'videos',
    icon: Video,
    title: 'Videos',
    description: 'Attach self-hosted video files, track publish status, set publish dates, and log platform links.',
    color: '#3B82F6',
  },
  {
    slug: 'brands',
    icon: Layers,
    title: 'Brands & Channels',
    description: 'Manage multiple YouTube/social channels as brands. Each brand has its own theme, niches, and palettes.',
    color: '#8B5CF6',
  },
  {
    slug: 'public',
    icon: Globe,
    title: 'Public Watch Page',
    description: 'How the public /watch page works, what gets shown, and how to control visibility per scenario.',
    color: '#14B8A6',
  },
  {
    slug: 'team',
    icon: Users,
    title: 'Team & Roles',
    description: 'Invite team members, understand admin vs editor roles, and manage scenario assignments.',
    color: '#F97316',
  },
  {
    slug: 'webhooks',
    icon: Webhook,
    title: 'Webhooks',
    description: 'Subscribe to scenario events and receive HMAC-signed POST requests to your own endpoints.',
    color: '#EF4444',
  },
  {
    slug: 'settings',
    icon: Settings,
    title: 'Settings',
    description: 'Profile, default preferences, brand configuration, and global app settings.',
    color: '#64748B',
  },
  {
    slug: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Common questions about hosting, AI tools, storage, and how pieces fit together.',
    color: '#A78BFA',
  },
]

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
            <BookOpen size={15} className="text-accent" />
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/30 font-medium">Documentation</p>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Veank Studio Docs</h1>
        <p className="text-brand-300 text-sm leading-relaxed max-w-xl">
          Everything you need to know — from creating your first scenario to publishing across multiple brands.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map(s => (
          <Link key={s.slug} href={`/docs/${s.slug}`}
            className="group relative p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: s.color + '18', border: `1px solid ${s.color}25` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white mb-1 group-hover:text-white/90">{s.title}</p>
                <p className="text-[12px] text-brand-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-[11px] text-white/15 text-center">
        Veank Studio — internal documentation · Not publicly accessible
      </p>
    </div>
  )
}
