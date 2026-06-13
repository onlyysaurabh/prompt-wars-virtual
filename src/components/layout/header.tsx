import Link from 'next/link'

export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-40 bg-midnight/80 backdrop-blur-xl border-b border-white/5">
      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent animate-gradient-line" style={{ backgroundSize: '200% 100%' }} />
      
      <nav role="navigation" aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" aria-label="CarbonTrack Home">
            <div className="relative h-6 w-6">
              <div className="absolute inset-0 rounded-full bg-ember/30 animate-pulse-ring" />
              <div className="relative h-6 w-6 rounded-full bg-ember flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.7)] transition-shadow duration-300">
                <div className="h-2 w-2 rounded-full bg-midnight" />
              </div>
            </div>
            <span className="text-xl font-serif font-bold text-paper tracking-tight">Carbon<span className="text-ember">Track</span></span>
          </Link>
          
          <ul className="flex items-center gap-6" role="menubar">
            <li role="none">
              <Link href="/dashboard" role="menuitem" className="relative text-sm font-medium text-slate hover:text-paper transition-colors py-1 group">
                Dashboard
                <span className="absolute bottom-0 left-0 right-0 h-px bg-ember scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </li>
            <li role="none">
              <Link href="/actions" role="menuitem" className="relative text-sm font-medium text-slate hover:text-paper transition-colors py-1 group">
                Log Action
                <span className="absolute bottom-0 left-0 right-0 h-px bg-ember scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </li>
            <li role="none">
              <Link href="/insights" role="menuitem" className="relative text-sm font-medium text-slate hover:text-paper transition-colors py-1 group">
                Insights
                <span className="absolute bottom-0 left-0 right-0 h-px bg-ember scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
