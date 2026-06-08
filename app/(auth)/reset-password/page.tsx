import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'

interface Props { searchParams: Promise<{ token?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#06080F] px-6">
      {/* Glow orb */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.05] blur-[120px]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-h flex items-center justify-center shadow-lg shadow-accent/20">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold tracking-tight leading-none">Veank Studio</p>
            <p className="text-[10px] text-brand-400 tracking-widest uppercase leading-none mt-0.5">Finance Content OS</p>
          </div>
        </div>

        {!token ? (
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.07] p-8 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Invalid link</p>
              <p className="text-xs text-brand-400 mt-1">This password reset link is missing or has expired.</p>
            </div>
            <Link href="/login" className="inline-block text-xs text-accent hover:text-accent-2 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Set new password</h1>
              <p className="text-sm text-brand-400 mt-1.5">Choose a strong password for your account</p>
            </div>
            <ResetPasswordForm token={token} />
          </>
        )}
      </div>
    </main>
  )
}
