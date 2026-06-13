import Link from 'next/link'
import { signup } from '../actions'
import { FloatingOrbs } from '@/components/landing/floating-orbs'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="dark flex min-h-[90vh] items-center justify-center bg-midnight text-paper selection:bg-ember/30 p-4 relative overflow-hidden">
      <FloatingOrbs />
      
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 backdrop-blur-lg p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10 relative z-10 animate-subtle-bob" style={{ animationDuration: '6s' }}>
        {/* Glow accent */}
        <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent" />
        
        <div className="text-center">
          <h2 className="text-4xl font-serif text-paper">Create an account</h2>
          <p className="mt-2 text-lg text-slate">Start tracking your footprint today</p>
        </div>
        
        <form className="mt-8 space-y-6" action={signup}>
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
                placeholder="Password (min 6 characters)"
                minLength={6}
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
              Sign up
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-slate">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-ember hover:text-ember-deep transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
