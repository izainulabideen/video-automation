import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-[#080B14]">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden bg-gradient-to-br from-[#0D1117] to-[#080B14] p-12 border-r border-white/[0.06]">
        {/* Glow orb */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-h flex items-center justify-center shadow-lg shadow-accent/20">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold tracking-tight leading-none">Veank Studio</p>
            <p className="text-[10px] text-brand-400 tracking-widest uppercase leading-none mt-0.5">Finance Content OS</p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative space-y-6">
          <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-transparent" />
          <blockquote className="space-y-3">
            <p className="text-2xl font-light text-white/80 leading-relaxed">
              Craft cinematic finance stories that educate millions.
            </p>
            <p className="text-sm text-brand-400">
              From concept to viral — all in one workspace.
            </p>
          </blockquote>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-0.5 rounded-full ${i === 0 ? 'w-6 bg-accent' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative text-[11px] text-brand-500">
          © {new Date().getFullYear()} Veank Studio. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-h flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="text-white font-bold tracking-tight">Veank Studio</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-brand-400 mt-1.5">Sign in to your studio</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
