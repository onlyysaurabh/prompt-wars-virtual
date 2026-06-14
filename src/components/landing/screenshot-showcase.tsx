'use client'

import Image from 'next/image'
import { MotionWrapper } from '@/components/motion-wrapper'

import screenshot1 from '../../../public/screenshot1.png'
import screenshot2 from '../../../public/screenshot2.png'
import screenshot3 from '../../../public/screenshot3.png'

const screenshots = [
  {
    src: screenshot1,
    alt: 'CarbonTrack dashboard showing daily emissions breakdown by category',
    caption: 'Dashboard',
  },
  {
    src: screenshot2,
    alt: 'CarbonTrack insights panel with personalized reduction tips',
    caption: 'Insights',
  },
  {
    src: screenshot3,
    alt: 'CarbonTrack action log for recording daily activities',
    caption: 'Actions',
  },
]

function DeviceFrame({ screenshot, index }: { screenshot: typeof screenshots[number]; index: number }) {
  const isCenter = index === 1
  
  return (
    <MotionWrapper delay={0.2 + index * 0.15} whileInView hover>
      <div className={`group rounded-[2rem] overflow-hidden border border-white/10 bg-sage/20 backdrop-blur-md shadow-2xl transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(212,255,0,0.15)] hover:scale-[1.02] ${isCenter ? 'md:-mt-8' : ''} hover:border-ember/30`}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-6 py-4 bg-white/[0.03] border-b border-white/5">
          <div className="flex gap-2">
            <span className="block w-3 h-3 rounded-full bg-white/20 group-hover:bg-destructive transition-colors duration-500" />
            <span className="block w-3 h-3 rounded-full bg-white/20 group-hover:bg-amber-400 transition-colors duration-500 delay-75" />
            <span className="block w-3 h-3 rounded-full bg-white/20 group-hover:bg-ember transition-colors duration-500 delay-150" />
          </div>
          <div className="flex-1 mx-4">
            <div className="mx-auto max-w-[200px] h-6 rounded-full bg-midnight/40 border border-white/5 flex items-center justify-center transition-colors group-hover:border-white/10">
              <span className="text-[11px] text-paper/40 font-mono tracking-wider group-hover:text-paper/70 transition-colors">carbontrack.app</span>
            </div>
          </div>
        </div>

        {/* Screenshot image */}
        <div className="relative aspect-[4/3] bg-midnight ring-1 ring-inset ring-white/5">
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
        </div>
        
        {/* Reflection glow */}
        <div className="absolute -bottom-4 left-1/4 right-1/4 h-12 bg-ember/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </MotionWrapper>
  )
}

export function ScreenshotShowcase() {
  return (
    <section className="py-32 bg-midnight relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sage/20 via-midnight to-midnight pointer-events-none" />
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sage/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <MotionWrapper delay={0.1} whileInView>
            <h2 className="text-5xl md:text-6xl font-serif text-paper mb-8 tracking-tight">
              A transparent <span className="text-ember italic">ledger.</span>
            </h2>
          </MotionWrapper>
          <MotionWrapper delay={0.2} whileInView>
            <p className="text-xl text-slate leading-relaxed font-light">
              Clear emissions tracking, granular insights, and undeniable progress. 
              The exact interface you need to change your footprint.
            </p>
          </MotionWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12 items-start px-4 sm:px-0">
          {screenshots.map((screenshot, i) => (
            <div key={screenshot.caption} className="flex flex-col items-center">
              <DeviceFrame screenshot={screenshot} index={i} />
              <MotionWrapper delay={0.4 + i * 0.1}>
                <p className="mt-8 text-center text-xs text-ember font-mono uppercase tracking-[0.2em] font-medium">
                  {screenshot.caption}
                </p>
              </MotionWrapper>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
