'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  delay?: number
  yOffset?: number
  duration?: number
  whileInView?: boolean
  hover?: boolean
}

export function MotionWrapper({ 
  children, 
  className,
  delay = 0,
  yOffset = 20,
  duration = 0.5,
  whileInView = false,
  hover = false,
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      {...(whileInView
        ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' } }
        : { animate: { opacity: 1, y: 0 } }
      )}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...(hover ? { whileHover: { y: -4, transition: { duration: 0.2 } } } : {})}
      className={className}
    >
      {children}
    </motion.div>
  )
}
