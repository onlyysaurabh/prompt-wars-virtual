import type { Metadata } from 'next'
import Link from 'next/link'
import { CO2Ticker } from '@/components/landing/co2-ticker'
import { FeatureCards } from '@/components/landing/feature-cards'
import { ScreenshotShowcase } from '@/components/landing/screenshot-showcase'
import { FloatingOrbs } from '@/components/landing/floating-orbs'
import { ParticleGrid } from '@/components/landing/particle-grid'
import { HeroEntrance } from '@/components/landing/hero-entrance'

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
        <FloatingOrbs />
        <ParticleGrid />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <HeroEntrance />
            
            {/* CO2 Ticker replaces DashboardMockup and GradientMesh */}
            <div className="w-full max-w-lg mx-auto lg:max-w-none">
              <CO2Ticker />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-24 bg-paper relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-ember/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sage/5 rounded-full blur-3xl animate-drift" style={{ animationDuration: '25s' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      
      {/* Screenshots */}
      <ScreenshotShowcase />
      
      {/* CTA section */}
      <section className="py-24 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-ember/10 via-midnight to-midnight pointer-events-none" />
        <FloatingOrbs />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-paper mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-slate mb-10">
            Start tracking your carbon footprint today. It only takes a few seconds per action.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-midnight bg-ember rounded-full hover:bg-ember-deep transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] hover:scale-105"
          >
            Get Started Now
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
