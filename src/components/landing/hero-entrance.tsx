'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroEntrance() {
  return (
    <div className="max-w-2xl text-left relative z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase bg-white/5 text-paper rounded-full mb-8 border border-white/10 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-ember animate-pulse-ring" />
        Precision Ecology
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-serif text-paper mb-8 leading-[0.9] tracking-tight"
      >
        Track your <br />
        <span className="text-ember italic">impact.</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl md:text-2xl text-slate mb-12 max-w-xl font-light leading-relaxed"
      >
        A deeply precise, intensely personal accounting of your carbon emissions. Measure it. Own it. Reduce it.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-5"
      >
        <Link
          href="/signup"
          className="group relative inline-flex items-center justify-center px-10 py-5 text-base font-medium text-midnight bg-ember rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center">
            Initialize Tracker
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </span>
        </Link>
        <Link
          href="#features"
          className="inline-flex items-center justify-center px-10 py-5 text-base font-medium text-paper bg-transparent border border-white/20 rounded-full hover:bg-white/5 transition-all duration-300 hover:border-white/40"
        >
          View Apparatus
        </Link>
      </motion.div>
    </div>
  )
}
