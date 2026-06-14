'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CO2Ticker() {
  const [co2, setCo2] = useState(424.8)

  useEffect(() => {
    const interval = setInterval(() => {
      setCo2((prev) => prev + (Math.random() * 0.05 + 0.01))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 bg-midnight rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ember/10 via-midnight to-midnight pointer-events-none" />
      
      {/* Slowly rotating gradient ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-ember/10 animate-rotate-slow" style={{ animationDuration: '40s' }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border border-ember/5 animate-rotate-slow" style={{ animationDuration: '55s', animationDirection: 'reverse' }} />
      </div>
      
      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full border border-ember/20 animate-pulse-ring" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full border border-ember/15 animate-pulse-ring-delayed" />
      </div>
      
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent animate-scanline" />
      </div>
      
      <div className="relative z-10 text-center space-y-6">
        <motion.div
          key={co2}
          initial={{ opacity: 0.8, y: 2, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-ember tracking-tighter tabular-nums"
        >
          {co2.toFixed(2)}
          <span className="text-3xl sm:text-4xl md:text-5xl text-ember/70 ml-2">ppm</span>
        </motion.div>
        
        <div className="flex items-center justify-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-ember animate-pulse" />
          <p className="text-slate uppercase tracking-widest text-sm font-medium">
            Atmospheric CO₂ concentration, 2026
          </p>
        </div>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-ember/20 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-ember/20 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-ember/20 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-ember/20 rounded-br-lg" />
    </div>
  )
}
