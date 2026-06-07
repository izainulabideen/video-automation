import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Veank Studio</h1>
          <p className="text-sm text-brand-500 mt-1">Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
