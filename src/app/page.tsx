import type { Metadata } from 'next'
import Link from 'next/link'
import { GradientMesh } from '@/components/landing/gradient-mesh'
import { FeatureCards } from '@/components/landing/feature-cards'
import { DashboardMockup } from '@/components/landing/dashboard-mockup'
import { SocialProof } from '@/components/landing/social-proof'

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
    <main id="main-content">
      {/* Hero with gradient mesh backdrop */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <GradientMesh />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Eyebrow pill */}
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-bg-subdued-hover text-primary-deep rounded-pill mb-6">
              YOUR CARBON FOOTPRINT, VISUALIZED
            </span>
            
            {/* Hero headline — Inter weight 300, negative tracking */}
            <h1 className="text-display-xxl font-display text-ink mb-6">
              Track Your Carbon
              <br />
              <span className="text-primary">Footprint</span>
            </h1>
            
            <p className="text-body-lg text-ink-secondary mb-8 max-w-xl mx-auto">
              Understand, track, and reduce your carbon footprint through simple actions 
              and personalized insights. Join thousands making a difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-on-primary bg-primary rounded-pill hover:bg-primary-deep transition-colors"
              >
                Start Tracking Free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary bg-white border border-primary rounded-pill hover:bg-primary-bg-subdued-hover transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Dashboard mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <DashboardMockup />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-24 bg-canvas-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-display text-ink mb-4">
              Everything You Need to Reduce Your Impact
            </h2>
            <p className="text-body-lg text-ink-secondary max-w-2xl mx-auto">
              Four simple categories to track your daily activities. 
              Get personalized insights and actionable tips to reduce your carbon footprint.
            </p>
          </div>
          
          <FeatureCards />
        </div>
      </section>
      
      {/* Social proof */}
      <section className="py-24 bg-canvas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SocialProof />
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-24 bg-brand-dark-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-lg font-display text-on-primary mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-body-lg text-gray-300 mb-8">
            Start tracking your carbon footprint today. It only takes a few seconds per action.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand-dark-900 bg-primary rounded-pill hover:bg-primary-soft transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  )
}
