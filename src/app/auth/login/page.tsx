import { LoginForm } from '@/components/login-form'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        {/* // inside the page (below <LoginForm />) */}
        <div className="mt-6 text-center text-sm">
          Prefer passwordless?{' '}
          <a className="underline underline-offset-4" href="/auth/login-otp">
            Login with email code
          </a>
        </div>
      </div>
    </div>
  )
}
