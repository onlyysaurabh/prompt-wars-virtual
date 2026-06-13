import Link from 'next/link'
import { login } from '../actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-card-1 border border-hairline">
        <div className="text-center">
          <h2 className="text-display-lg font-display text-ink">Welcome back</h2>
          <p className="mt-2 text-body-md text-ink-secondary">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" action={login}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border-hairline-input px-3 py-2 text-ink placeholder-ink-mute focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm border"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-hairline-input px-3 py-2 text-ink placeholder-ink-mute focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm border"
                placeholder="Password"
              />
            </div>
          </div>

          {params.error && (
            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
              {params.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-pill bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-deep focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-ink-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:text-primary-deep">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
