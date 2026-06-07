import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { redirect } from 'next/navigation'

interface Props { searchParams: Promise<{ token?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams
  if (!token) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Veank Content OS</h1>
          <p className="text-sm text-brand-500 mt-1">Set a new password</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  )
}
