import Link from 'next/link'
import { login } from '../actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="dark flex min-h-[90vh] items-center justify-center bg-midnight text-paper selection:bg-ember/30 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 backdrop-blur-lg p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10">
        <div className="text-center">
          <h2 className="text-4xl font-serif text-paper">Welcome back</h2>
          <p className="mt-2 text-lg text-slate">Sign in to your account</p>
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
                className="relative block w-full rounded-md bg-white/5 border-white/20 px-3 py-3 text-paper placeholder-slate focus:z-10 focus:border-ember focus:outline-none focus:ring-ember sm:text-sm border transition-colors"
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
                className="relative block w-full rounded-md bg-white/5 border-white/20 px-3 py-3 text-paper placeholder-slate focus:z-10 focus:border-ember focus:outline-none focus:ring-ember sm:text-sm border transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          {params.error && (
            <div className="text-sm text-red-400 text-center bg-red-950/50 border border-red-900/50 p-2 rounded">
              {params.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-full bg-ember px-4 py-3 text-base font-bold text-midnight hover:bg-ember-deep focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-midnight transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-slate">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-ember hover:text-ember-deep transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
