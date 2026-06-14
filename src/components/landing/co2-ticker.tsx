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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-20 bg-sage/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Animated gradient background inside the glass */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage/20 via-transparent to-midnight/80 pointer-events-none" />
      
      {/* Subtle organic noise texture (CSS driven) */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      
      {/* Slowly rotating glass rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[120%] h-[120%] rounded-full border border-white/5 animate-rotate-slow" style={{ animationDuration: '60s' }} />
      </div>
      
      {/* Scanline / Light sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember/40 to-transparent animate-scanline" style={{ animationDuration: '8s' }} />
      </div>
      
      <div className="relative z-10 text-center space-y-6">
        <motion.div
          key={co2}
          initial={{ opacity: 0.8, y: 2, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="font-mono text-6xl sm:text-8xl md:text-[8rem] font-medium text-ember tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(212,255,0,0.3)]"
        >
          {co2.toFixed(2)}
        </motion.div>
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-paper/60 uppercase tracking-[0.3em] text-xs font-semibold">
            Global CO₂ Average
          </p>
          <div className="flex items-center space-x-2 text-paper/40 font-mono text-xs">
            <span>LIVE</span>
            <div className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
            <span>PPM</span>
          </div>
        </div>
      </div>
      
      {/* Corner crosshairs for technical feel */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/20" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/20" />
      <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/20" />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/20" />
    </div>
  )
}
