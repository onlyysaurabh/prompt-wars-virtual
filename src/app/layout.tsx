import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import { SkipLink } from '@/components/layout/skip-link'
import { FocusManager } from '@/components/layout/focus-manager'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-serif', axes: ['SOFT', 'WONK'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// JSON-LD structured data for AI crawlers
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'CarbonTrack',
  'description': 'Track and reduce your carbon footprint through simple actions and personalized insights.',
  'url': 'https://carbontrack.app',
  'applicationCategory': 'LifestyleApplication',
  'operatingSystem': 'Web',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
  'featureList': [
    'Carbon footprint tracking across transport, energy, food, and shopping',
    'Personalized reduction tips based on your activity',
    'Country-level benchmarking and comparisons',
    'Gamified achievements and streaks',
    'Visual dashboard with charts and breakdowns',
  ],
}

export const metadata: Metadata = {
  title: { template: '%s | CarbonTrack', default: 'CarbonTrack — Track Your Carbon Footprint' },
  description: 'Understand, track, and reduce your carbon footprint through simple actions and personalized insights.',
  openGraph: {
    title: 'CarbonTrack',
    description: 'Track and reduce your carbon footprint',
    type: 'website',
    siteName: 'CarbonTrack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarbonTrack',
    description: 'Track and reduce your carbon footprint',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SkipLink />
        <FocusManager />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
