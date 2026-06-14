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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 bg-midnight rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ember/10 via-midnight to-midnight pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-6">
        <motion.div
          key={co2}
          initial={{ opacity: 0.8, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-ember tracking-tighter tabular-nums"
        >
          {co2.toFixed(2)}
          <span className="text-3xl sm:text-4xl md:text-5xl text-ember/70 ml-2">ppm</span>
        </motion.div>
        
        <div className="flex items-center justify-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-ember animate-pulse" />
          <p className="text-slate uppercase tracking-widest text-sm font-medium">
            Atmospheric CO₂ concentration, 2024
          </p>
        </div>
      </div>
    </div>
  )
}
