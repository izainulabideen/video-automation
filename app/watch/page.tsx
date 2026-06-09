import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { WatchFilters } from '@/components/watch/WatchFilters'
import { HeroAmbience } from '@/components/watch/HeroAmbience'
import { FadeIn } from '@/components/watch/FadeIn'
import type { BrandTheme } from '@/types/brand'

export const revalidate = 300
const PAGE_SIZE = 12

interface Props {
  searchParams: Promise<{ brand?: string; niche?: string; q?: string; page?: string }>
}
type ScenarioRow = { id:string; title:string; niche:string; hook:string; created_at:string; status:string; brand_id:string|null }
type BrandRow = { id:string; name:string; slug:string; theme_config:BrandTheme }

function heroConfig(style:string, accent:string, accentH:string, bg:string, name:string, tagline:string) {
  switch(style) {
    case 'horror': return {
      heroBg: `radial-gradient(ellipse at 50% 0%, ${accent}30 0%, ${bg} 55%)`,
      heroPattern: `repeating-linear-gradient(0deg, ${accent}08 0px, transparent 1px, transparent 60px, ${accent}08 61px)`,
      eyebrow: '— A DARK CHANNEL —', eyebrowColor: accent+'aa',
      hl1: name.toUpperCase(), hl2: 'STORIES',
      hl1Style: { color:'#fff', letterSpacing:'-0.05em', textShadow:`0 0 80px ${accent}60` },
      hl2Style: { background:`linear-gradient(180deg,${accent} 0%,#400000 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-0.05em' },
      sub: 'Fear has a story. Every story has a price.',
      glowTop: `radial-gradient(ellipse at 50% -10%, ${accent}40 0%, transparent 55%)`,
      divider: accent+'55', fw:'900',
    }
    case 'minimal': return {
      heroBg: bg, heroPattern: `radial-gradient(circle at 50% 50%, ${accent}0a 0%, transparent 60%)`,
      eyebrow: tagline.toUpperCase(), eyebrowColor: accent+'80',
      hl1: name, hl2: 'Stories',
      hl1Style: { color:`${accent}cc`, fontWeight:300, letterSpacing:'0.06em', fontSize:'clamp(1.2rem,4vw,3.5rem)' } as React.CSSProperties,
      hl2Style: { color:'#ffffff', fontWeight:800, letterSpacing:'-0.04em' },
      sub: 'Ideas that change how you see everything.',
      glowTop: `radial-gradient(ellipse at 50% 30%, ${accent}12 0%, transparent 70%)`,
      divider: accent+'30', fw:'400',
    }
    case 'clinical': return {
      heroBg: bg,
      heroPattern: `repeating-linear-gradient(90deg,${accent}06 0px,transparent 1px,transparent 80px,${accent}06 81px),repeating-linear-gradient(0deg,${accent}06 0px,transparent 1px,transparent 80px,${accent}06 81px)`,
      eyebrow: `[ ${tagline} ]`, eyebrowColor: accent,
      hl1: name, hl2: 'Analysis',
      hl1Style: { color:'#fff', letterSpacing:'0.02em', fontWeight:700 },
      hl2Style: { color:accent, letterSpacing:'0.08em', fontWeight:400, fontStyle:'italic' },
      sub: 'Evidence-based. Precisely observed. Uncomfortably accurate.',
      glowTop: `radial-gradient(ellipse at 70% 30%, ${accent}18 0%, transparent 60%)`,
      divider: accent+'40', fw:'700',
    }
    case 'epic': return {
      heroBg: `linear-gradient(160deg,${accent}20 0%,${bg} 40%)`,
      heroPattern: `repeating-linear-gradient(135deg,${accent}06 0px,transparent 1px,transparent 40px,${accent}06 41px)`,
      eyebrow: `✦ ${tagline} ✦`, eyebrowColor: accent+'99',
      hl1: name, hl2: 'Chronicles',
      hl1Style: { color:'#fff', letterSpacing:'-0.03em', fontWeight:900, textTransform:'uppercase' as const },
      hl2Style: { background:`linear-gradient(135deg,${accentH} 0%,${accent} 60%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-0.03em', fontWeight:900 },
      sub: 'The stories that shaped reality. Unfiltered.',
      glowTop: `radial-gradient(ellipse at 20% 40%, ${accent}25 0%, transparent 55%)`,
      divider: accent+'50', fw:'900',
    }
    case 'mystical': return {
      heroBg: `radial-gradient(ellipse at 30% 20%,${accent}20 0%,${bg} 50%),radial-gradient(ellipse at 70% 80%,${accent}12 0%,${bg} 50%)`,
      heroPattern: `radial-gradient(circle at 20% 30%,${accent}08 0%,transparent 30%),radial-gradient(circle at 80% 70%,${accent}06 0%,transparent 25%)`,
      eyebrow: '⸻  Ancient · Eternal  ⸻', eyebrowColor: accent+'88',
      hl1: name, hl2: 'Legends',
      hl1Style: { color:accent+'dd', letterSpacing:'0.08em', fontWeight:800 },
      hl2Style: { background:`linear-gradient(135deg,#fff 0%,${accentH} 50%,${accent}88 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-0.02em', fontWeight:900 },
      sub: 'Before history, there were the gods. Before the gods, there were the stories.',
      glowTop: `radial-gradient(ellipse at 30% 20%,${accent}30 0%,transparent 50%)`,
      divider: accent+'50', fw:'800',
    }
    case 'tech': return {
      heroBg: bg,
      heroPattern: `linear-gradient(${accent}08 1px,transparent 1px),linear-gradient(90deg,${accent}08 1px,transparent 1px)`,
      eyebrow: `> ${tagline} _`, eyebrowColor: accent,
      hl1: name, hl2: '// Stories',
      hl1Style: { color:'#fff', letterSpacing:'-0.02em', fontWeight:700, fontFamily:'monospace' },
      hl2Style: { color:accent, letterSpacing:'-0.01em', fontWeight:400, fontFamily:'monospace' },
      sub: 'Signal. No noise. The future, explained.',
      glowTop: `radial-gradient(ellipse at 50% 0%,${accent}25 0%,transparent 50%)`,
      divider: accent, fw:'700',
    }
    case 'warm': return {
      heroBg: `radial-gradient(ellipse at 50% 60%,${accent}20 0%,${bg} 60%)`,
      heroPattern: `radial-gradient(circle at 80% 20%,${accentH}15 0%,transparent 40%)`,
      eyebrow: tagline, eyebrowColor: accentH,
      hl1: name, hl2: 'Stories',
      hl1Style: { color:'#fff', letterSpacing:'-0.04em', fontWeight:900 },
      hl2Style: { background:`linear-gradient(135deg,${accentH} 0%,${accent} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-0.04em', fontWeight:900 },
      sub: 'The habits, mindsets and systems that actually work.',
      glowTop: `radial-gradient(ellipse at 50% 60%,${accent}30 0%,transparent 55%)`,
      divider: accentH+'55', fw:'900',
    }
    default: return {
      heroBg: bg, heroPattern: 'none',
      eyebrow: 'Veank Studio', eyebrowColor: accent+'99',
      hl1: name==='All Stories'?'Premium':name, hl2: 'Stories',
      hl1Style: { color:'#fff' },
      hl2Style: { background:`linear-gradient(135deg,${accentH} 0%,${accent} 40%,${accent}88 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
      sub: 'Cinematic education. Real insights, no noise.',
      glowTop: `radial-gradient(ellipse at 50% 30%,${accent}30 0%,transparent 65%)`,
      divider: accent+'55', fw:'900',
    }
  }
}

export default async function WatchPage({ searchParams }:Props) {
  const params = await searchParams
  const page = Math.max(1,parseInt(params.page??'1',10))
  const supabase = createAdminClient()

  const { data: brands } = await supabase.from('brands').select('id,name,slug,theme_config').eq('is_active',true).order('name')
  const allBrands: BrandRow[] = brands??[]

  const { data: rows } = await supabase.from('public_settings').select('scenario_id,scenarios(id,title,niche,hook,created_at,status,brand_id)').eq('is_public',true)
  let scenarios = ((rows??[]).flatMap(r=>Array.isArray(r.scenarios)?r.scenarios:r.scenarios?[r.scenarios]:[]).filter(Boolean)) as ScenarioRow[]

  if(params.brand) scenarios=scenarios.filter(s=>allBrands.find(b=>b.id===s.brand_id)?.slug===params.brand)
  if(params.niche) scenarios=scenarios.filter(s=>s.niche===params.niche)
  if(params.q){const q=params.q.toLowerCase();scenarios=scenarios.filter(s=>s.title.toLowerCase().includes(q)||s.hook?.toLowerCase().includes(q))}

  const totalPages=Math.ceil(scenarios.length/PAGE_SIZE)
  const paginated=scenarios.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
  const published=paginated.filter(s=>s.status==='published')
  const upcoming=paginated.filter(s=>s.status!=='published')

  const activeBrand=params.brand?allBrands.find(b=>b.slug===params.brand):null
  const accent=activeBrand?.theme_config?.accent??'#C8922A'
  const accentH=activeBrand?.theme_config?.accentH??'#E8B84B'
  const bg=activeBrand?.theme_config?.bg??'#06080F'
  const surface=activeBrand?.theme_config?.surface??'#0D1117'
  const tagline=activeBrand?.theme_config?.tagline??'Premium · Stories'
  const style=activeBrand?.theme_config?.heroStyle??'cinematic'
  const name=activeBrand?.name??'All Stories'

  const hero=heroConfig(style,accent,accentH,bg,name,tagline)
  const brandMap=Object.fromEntries(allBrands.map(b=>[b.id,b]))
  const allNiches=Array.from(new Set(scenarios.map(s=>s.niche).filter(Boolean)))
  const isTech=style==='tech'

  const pq=(extra:Record<string,string>={})=>new URLSearchParams({...(params.brand?{brand:params.brand}:{}),...(params.niche?{niche:params.niche}:{}),...(params.q?{q:params.q}:{}),...extra}).toString()

  return (
    <div className="min-h-screen text-white" style={{background:bg}}>
      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,backgroundSize:'200px 200px'}}/>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b" style={{background:bg+'e0',borderColor:accent+'18'}}>
        <div className="flex items-center justify-between px-4 md:px-8 py-2 md:py-3 gap-3 min-h-[52px]">
          {/* Logo */}
          <Link href="/watch" className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:`linear-gradient(135deg,${accent},${accentH})`}}>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/></svg>
            </div>
            <span className="text-[13px] font-bold text-white">Veank</span>
          </Link>

          {/* Brand switcher — scrollable on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0 px-2">
            <Link href="/watch" className="text-[11px] px-3 py-1 rounded-full border whitespace-nowrap transition-all shrink-0"
              style={!params.brand?{borderColor:accent+'55',background:accent+'18',color:accentH}:{borderColor:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)'}}>
              All
            </Link>
            {allBrands.map(b=>(
              <Link key={b.id} href={`/watch?brand=${b.slug}`}
                className="text-[11px] px-3 py-1 rounded-full border whitespace-nowrap transition-all shrink-0"
                style={params.brand===b.slug?{borderColor:b.theme_config.accent+'55',background:b.theme_config.accent+'18',color:b.theme_config.accentH}:{borderColor:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)'}}>
                {b.name}
              </Link>
            ))}
          </div>

          <span className="hidden lg:block text-[10px] tracking-[0.2em] uppercase shrink-0" style={{color:accent+'55'}}>{tagline}</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[90vh] md:min-h-[94vh] flex flex-col items-center justify-center px-4 md:px-5 text-center overflow-hidden pt-14 md:pt-16" style={{background:hero.heroBg}}>
        {hero.heroPattern!=='none'&&<div className="absolute inset-0" style={{backgroundImage:hero.heroPattern,backgroundSize:isTech?'60px 60px':undefined}}/>}
        <div className="absolute inset-0 pointer-events-none" style={{background:hero.glowTop}}/>
        {/* Ambience */}
        <HeroAmbience style={style} accent={accent} accentH={accentH}/>
        {/* Tech brackets */}
        {isTech&&<>
          <div className="absolute top-20 left-6 w-7 h-7 border-l-2 border-t-2 opacity-25" style={{borderColor:accent}}/>
          <div className="absolute top-20 right-6 w-7 h-7 border-r-2 border-t-2 opacity-25" style={{borderColor:accent}}/>
          <div className="absolute bottom-20 left-6 w-7 h-7 border-l-2 border-b-2 opacity-25" style={{borderColor:accent}}/>
          <div className="absolute bottom-20 right-6 w-7 h-7 border-r-2 border-b-2 opacity-25" style={{borderColor:accent}}/>
        </>}
        {/* Horror lines */}
        {style==='horror'&&<>
          <div className="absolute left-[12%] top-0 w-px h-full opacity-15" style={{background:`linear-gradient(to bottom,transparent,${accent},transparent)`}}/>
          <div className="absolute right-[18%] top-0 w-px h-full opacity-10" style={{background:`linear-gradient(to bottom,transparent,${accent},transparent)`}}/>
        </>}

        {/* Eyebrow */}
        <div className="relative z-10 flex items-center gap-3 mb-6 md:mb-8">
          {!isTech&&<div className="w-8 md:w-12 h-px" style={{background:hero.divider}}/>}
          <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-medium" style={{color:hero.eyebrowColor,fontFamily:isTech?'monospace':undefined}}>{hero.eyebrow}</span>
          {!isTech&&<div className="w-8 md:w-12 h-px" style={{background:hero.divider}}/>}
        </div>

        {/* Headline */}
        <h1 className="relative z-10 leading-[0.9] tracking-tight mb-5 md:mb-6 px-2" style={{fontSize:'clamp(2.8rem,10vw,9rem)',fontWeight:hero.fw}}>
          <span className="block" style={hero.hl1Style as React.CSSProperties}>{hero.hl1}</span>
          <span className="block mt-1" style={hero.hl2Style as React.CSSProperties}>{hero.hl2}</span>
        </h1>

        <p className="relative z-10 max-w-xs md:max-w-md mx-auto leading-relaxed text-white/40 font-light text-sm md:text-base" style={{fontFamily:isTech?'monospace':undefined,fontStyle:style==='clinical'?'italic':undefined}}>
          {hero.sub}
        </p>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-20">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/60"/>
          <span className="text-[8px] tracking-[0.35em] uppercase text-white/50" style={{fontFamily:isTech?'monospace':undefined}}>{isTech?'↓':'Scroll'}</span>
        </div>
      </section>

      {/* Filter bar */}
      <WatchFilters allNiches={allNiches}/>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-8">
        {!scenarios.length?(
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-14 h-14 rounded-2xl border border-white/[0.06] flex items-center justify-center">
              <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
            <p className="text-white/20 text-sm tracking-widest uppercase">No stories yet</p>
          </div>
        ):(
          <>
            {published.length>0&&(
              <div className="mb-16 md:mb-20">
                <div className="flex items-center gap-4 mb-8 md:mb-10">
                  <div className="w-1.5 h-1.5 rounded-full" style={{background:accent}}/>
                  <span className="text-[10px] tracking-[0.35em] uppercase text-white/30">Available Now</span>
                  <div className="flex-1 h-px bg-white/[0.04]"/>
                  <span className="text-[10px] text-white/20">{published.length} stories</span>
                </div>
                {/* Featured */}
                {published[0]&&(()=>{
                  const b=brandMap[published[0].brand_id??'']
                  const a=b?.theme_config?.accent??accent
                  const aH=b?.theme_config?.accentH??accentH
                  return (
                    <FadeIn delay={0}>
                      <Link href={`/watch/${published[0].id}`}
                        className="group relative block mb-3 md:mb-4 rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500">
                        <div className="aspect-[16/6] md:aspect-[21/7] relative overflow-hidden flex items-end p-5 md:p-10" style={{background:`linear-gradient(135deg,${a}22 0%,${surface} 55%,${bg} 100%)`}}>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background:`radial-gradient(ellipse at 25% 50%,${a}20 0%,transparent 60%)`}}/>
                          <div className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:scale-110 transition-all duration-300">
                            <svg className="w-5 h-5 ml-0.5 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" style={{color:a+'80'}}><path d="M8 5v14l11-7z"/></svg>
                          </div>
                          <div className="relative z-10 max-w-xl">
                            {b&&<span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase mb-2 px-2.5 py-0.5 rounded-full border" style={{borderColor:a+'30',color:a,background:a+'12'}}><span className="w-1 h-1 rounded-full" style={{background:a}}/>{b.name}</span>}
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-white/90 transition-colors mt-1">{published[0].title}</h2>
                            <p className="mt-2 text-white/30 text-sm leading-relaxed line-clamp-2 hidden sm:block">{published[0].hook}</p>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:`linear-gradient(90deg,transparent,${aH}60,transparent)`}}/>
                        </div>
                      </Link>
                    </FadeIn>
                  )
                })()}
                {published.length>1&&(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {published.slice(1).map((s,i)=>(
                      <FadeIn key={s.id} delay={i*60}>
                        <StoryCard s={s} brand={brandMap[s.brand_id??'']} pageBg={bg} surface={surface}/>
                      </FadeIn>
                    ))}
                  </div>
                )}
              </div>
            )}
            {upcoming.length>0&&(
              <div className="mb-16 md:mb-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>
                  <span className="text-[10px] tracking-[0.35em] uppercase text-white/20">Coming Soon</span>
                  <div className="flex-1 h-px bg-white/[0.04]"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcoming.map((s,i)=>(
                    <FadeIn key={s.id} delay={i*60}>
                      <StoryCard s={s} brand={brandMap[s.brand_id??'']} pageBg={bg} surface={surface} dimmed/>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Pagination */}
      {totalPages>1&&(
        <div className="flex items-center justify-center gap-3 pb-10">
          {page>1&&<a href={`/watch?${pq({page:String(page-1)})}`} className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white transition-all">← Prev</a>}
          <span className="text-[11px] text-white/20">{page} / {totalPages}</span>
          {page<totalPages&&<a href={`/watch?${pq({page:String(page+1)})}`} className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white transition-all">Next →</a>}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-8 md:py-10 px-4 md:px-8" style={{borderColor:accent+'18'}}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{background:`linear-gradient(135deg,${accent},${accentH})`}}>
              <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.95"/></svg>
            </div>
            <span className="text-[11px] text-white/30 tracking-wider">Veank Studio</span>
          </div>
          <p className="text-[10px] text-white/15 tracking-widest uppercase">{tagline} · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

function StoryCard({s,brand,pageBg,surface,dimmed}:{s:ScenarioRow;brand?:BrandRow;pageBg:string;surface:string;dimmed?:boolean}) {
  const a=brand?.theme_config?.accent??'#C8922A'
  const aH=brand?.theme_config?.accentH??'#E8B84B'
  const sBg=brand?.theme_config?.surface??surface
  const nicheLabel=brand?.theme_config?.nicheLabels?.[s.niche]??s.niche?.replace(/_/g,' ')
  return (
    <Link href={`/watch/${s.id}`} className={`group relative block rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 h-full ${dimmed?'opacity-40':''}`}>
      <div className="aspect-video relative overflow-hidden" style={{background:`linear-gradient(135deg,${a}15 0%,${pageBg} 100%)`}}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:`radial-gradient(ellipse at 50% 50%,${a}18 0%,transparent 70%)`}}/>
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}}/>
        <div className="absolute inset-0 flex items-center justify-center">
          {s.status==='published'?(
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 backdrop-blur-sm bg-black/20">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24" style={{color:aH}}><path d="M8 5v14l11-7z"/></svg>
            </div>
          ):<span className="text-[9px] tracking-[0.4em] uppercase text-white/15">Soon</span>}
        </div>
      </div>
      <div className="p-4 md:p-5" style={{background:sBg}}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {brand&&<span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded border shrink-0" style={{borderColor:a+'35',color:a,background:a+'12'}}>{brand.name}</span>}
          {nicheLabel&&<span className="text-[10px] text-white/25 capitalize">{nicheLabel}</span>}
        </div>
        <h3 className="text-white/90 font-bold text-[13px] md:text-[14px] leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">{s.title}</h3>
        <p className="text-white/25 text-[11px] md:text-xs leading-relaxed line-clamp-2">{s.hook}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background:`linear-gradient(90deg,transparent,${a}50,transparent)`}}/>
    </Link>
  )
}
