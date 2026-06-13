import type { Metadata } from 'next'
import Link from 'next/link'
import { CO2Ticker } from '@/components/landing/co2-ticker'
import { FeatureCards } from '@/components/landing/feature-cards'

export const metadata: Metadata = {
  title: 'CarbonTrack — Understand, Track, and Reduce Your Carbon Footprint',
  description: 'Track your carbon footprint through simple actions. Get personalized insights, actionable tips, and gamified achievements to reduce your environmental impact.',
  openGraph: {
    title: 'CarbonTrack',
    description: 'Understand, track, and reduce your carbon footprint',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <main id="main-content" className="bg-paper text-midnight">
      {/* Hero with CO2 Ticker */}
      <section className="relative min-h-[90vh] bg-midnight overflow-hidden flex flex-col items-center justify-center py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ember/5 via-midnight to-midnight pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl text-left">
              {/* Eyebrow pill */}
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-ember/10 text-ember rounded-full mb-6 border border-ember/20">
                Precision Ecology
              </span>
              
              {/* Hero headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-paper mb-6 leading-tight">
                Track Your Carbon <br className="hidden sm:block" />
                <span className="text-ember italic">Footprint.</span>
              </h1>
              
              <p className="text-lg text-slate mb-8 max-w-xl">
                Carbon tracking as atmospheric science. Precise, data-rich, and personal. 
                Understand your emissions and join the movement to reduce global CO₂ levels.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-midnight bg-ember rounded-full hover:bg-ember-deep transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  Start Tracking
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-paper bg-transparent border border-slate/30 rounded-full hover:bg-slate/10 transition-colors"
                >
                  Explore Features
                </Link>
              </div>
            </div>
            
            {/* CO2 Ticker replaces DashboardMockup and GradientMesh */}
            <div className="w-full max-w-lg mx-auto lg:max-w-none">
              <CO2Ticker />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-midnight mb-6">
              Everything You Need to Reduce Your Impact
            </h2>
            <p className="text-lg text-slate/80">
              Four simple categories to track your daily activities. 
              Get personalized insights and actionable tips to reduce your carbon footprint.
            </p>
          </div>
          
          <FeatureCards />
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-24 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-ember/10 via-midnight to-midnight pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-paper mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-slate mb-10">
            Start tracking your carbon footprint today. It only takes a few seconds per action.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-midnight bg-ember rounded-full hover:bg-ember-deep transition-colors shadow-[0_0_30px_rgba(245,158,11,0.4)]"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  )
}
