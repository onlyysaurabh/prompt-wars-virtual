import Link from 'next/link'

export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-40 bg-midnight border-b border-white/5">
      <nav role="navigation" aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="CarbonTrack Home">
            <div className="h-6 w-6 rounded-full bg-ember flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              <div className="h-2 w-2 rounded-full bg-midnight" />
            </div>
            <span className="text-xl font-serif font-bold text-paper tracking-tight">Carbon<span className="text-ember">Track</span></span>
          </Link>
          
          <ul className="flex items-center gap-6" role="menubar">
            <li role="none">
              <Link href="/dashboard" role="menuitem" className="text-sm font-medium text-slate hover:text-paper transition-colors">
                Dashboard
              </Link>
            </li>
            <li role="none">
              <Link href="/actions" role="menuitem" className="text-sm font-medium text-slate hover:text-paper transition-colors">
                Log Action
              </Link>
            </li>
            <li role="none">
              <Link href="/insights" role="menuitem" className="text-sm font-medium text-slate hover:text-paper transition-colors">
                Insights
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
