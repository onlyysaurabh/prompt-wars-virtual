import Link from 'next/link'
import { login } from '../actions'
import { FloatingOrbs } from '@/components/landing/floating-orbs'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-midnight text-paper selection:bg-ember/30 p-4 relative overflow-hidden">
      {/* Full page gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-ember/20 via-midnight to-midnight pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-ember/10 via-transparent to-transparent pointer-events-none" />
      
      <FloatingOrbs />
      
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-midnight/60 backdrop-blur-xl p-10 shadow-[0_0_40px_rgba(212,255,0,0.15)] border border-ember/30 relative z-10 animate-subtle-bob" style={{ animationDuration: '6s' }}>
        {/* Glow accent */}
        <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent" />
        
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
                className="relative block w-full rounded-md bg-white/5 border-white/20 px-3 py-3 text-paper placeholder-slate focus:z-10 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30 sm:text-sm border transition-all duration-300 hover:border-white/30"
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
                className="relative block w-full rounded-md bg-white/5 border-white/20 px-3 py-3 text-paper placeholder-slate focus:z-10 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30 sm:text-sm border transition-all duration-300 hover:border-white/30"
                placeholder="Password"
              />
            </div>
          </div>

          {params.error && (
            <div className="text-sm text-red-400 text-center bg-red-950/50 border border-red-900/50 p-2 rounded animate-in fade-in-0 duration-200">
              {params.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-full bg-ember px-4 py-3 text-base font-bold text-midnight hover:bg-ember-deep focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-midnight transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02]"
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
