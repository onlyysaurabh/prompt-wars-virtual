import Link from 'next/link'

export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-40 bg-canvas border-b border-hairline">
      <nav role="navigation" aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="CarbonTrack Home">
            <span className="text-xl font-semibold text-ink">CarbonTrack</span>
          </Link>
          
          <ul className="flex items-center gap-6" role="menubar">
            <li role="none">
              <Link href="/dashboard" role="menuitem" className="text-body-md text-ink-secondary hover:text-primary">
                Dashboard
              </Link>
            </li>
            <li role="none">
              <Link href="/actions" role="menuitem" className="text-body-md text-ink-secondary hover:text-primary">
                Log Action
              </Link>
            </li>
            <li role="none">
              <Link href="/insights" role="menuitem" className="text-body-md text-ink-secondary hover:text-primary">
                Insights
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
