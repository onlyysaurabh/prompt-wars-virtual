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
      <section className="relative min-h-[95vh] bg-midnight overflow-hidden flex flex-col items-center justify-center py-24">
        {/* Soft aurora gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sage/40 via-midnight to-midnight pointer-events-none" />
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-sage/20 rounded-[100%] blur-[120px] mix-blend-screen pointer-events-none" />
        
        <FloatingOrbs />
        <ParticleGrid />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <HeroEntrance />
            
            <div className="w-full max-w-lg mx-auto lg:max-w-none relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-ember/0 via-ember/20 to-ember/0 rounded-3xl blur-xl" />
              <CO2Ticker />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-32 bg-paper relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Glasshouse light bleeds */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-ember/5 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sage/5 rounded-full blur-[100px] animate-drift" style={{ animationDuration: '30s' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-20 max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-serif text-midnight mb-8 leading-tight tracking-tight">
              A precise instrument for a <span className="italic text-sage">delicate ecosystem.</span>
            </h2>
            <p className="text-xl text-slate/90 leading-relaxed max-w-2xl">
              Track four vital categories. Measure your daily impact. 
              Recalibrate your choices with data-driven insights tailored to your life.
            </p>
          </div>
          
          <FeatureCards />
        </div>
      </section>
      
      {/* Screenshots */}
      <ScreenshotShowcase />
      
      {/* CTA section */}
      <section className="py-32 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-sage/30 via-midnight to-midnight pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-ember/5 rounded-full blur-[120px] pointer-events-none" />
        
        <FloatingOrbs />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-paper mb-8 italic tracking-tight">
            Take the first step.
          </h2>
          <p className="text-xl text-slate mb-12 max-w-2xl mx-auto leading-relaxed">
            Begin logging your environmental footprint. The data is waiting.
          </p>
          <Link
            href="/signup"
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-medium text-midnight bg-ember rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center">
              Create Free Account
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
