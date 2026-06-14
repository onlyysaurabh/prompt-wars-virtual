'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroEntrance() {
  return (
    <div className="max-w-2xl text-left">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-ember/10 text-ember rounded-full mb-6 border border-ember/20"
      >
        Precision Ecology
      </motion.span>
      
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-5xl sm:text-6xl md:text-7xl font-serif text-paper mb-6 leading-tight"
      >
        Track Your Carbon <br className="hidden sm:block" />
        <span className="text-ember italic">Footprint.</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-lg text-slate mb-8 max-w-xl"
      >
        Carbon tracking as atmospheric science. Precise, data-rich, and personal. 
        Understand your emissions and join the movement to reduce global CO₂ levels.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/signup"
          className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-midnight bg-ember rounded-full hover:bg-ember-deep transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-105"
        >
          Start Tracking
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </Link>
        <Link
          href="#features"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-paper bg-transparent border border-slate/30 rounded-full hover:bg-slate/10 hover:border-slate/50 transition-all duration-300 hover:scale-105"
        >
          Explore Features
        </Link>
      </motion.div>
    </div>
  )
}
