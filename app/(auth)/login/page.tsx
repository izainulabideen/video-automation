import { LoginForm } from '@/components/auth/LoginForm'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Veank Content OS</h1>
          <p className="text-sm text-brand-500 mt-1">Sign in to continue</p>
        </div>
        {params.error === 'auth_failed' && (
          <p className="mb-4 text-xs text-center text-danger bg-red-50 border border-red-200 rounded-md py-2 px-3">
            Authentication failed. Please try again.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  )
}
