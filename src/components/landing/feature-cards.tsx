'use client'

import { 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag 
} from 'lucide-react'
import { MotionWrapper } from '@/components/motion-wrapper'

const features = [
  {
    icon: Car,
    title: 'Transport',
    description: 'Track flights, car trips, public transit, cycling, and walking. Calculate emissions based on distance, vehicle type, and passengers.',
  },
  {
    icon: Zap,
    title: 'Energy',
    description: 'Monitor electricity, gas, and heating usage. See how your energy source affects your carbon footprint.',
  },
  {
    icon: Utensils,
    title: 'Food',
    description: 'Log meals and track the carbon impact of your diet. Compare plant-based vs. meat-heavy meals.',
  },
  {
    icon: ShoppingBag,
    title: 'Shopping',
    description: 'Track purchases across clothing, electronics, and furniture. Make informed choices about consumption.',
  },
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, i) => (
        <MotionWrapper
          key={feature.title}
          delay={i * 0.1}
          whileInView
          hover
        >
          <article className="relative bg-white rounded-2xl p-8 border border-slate/20 hover:border-ember/50 transition-all duration-300 group hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)] hover:-translate-y-1.5 h-full">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-ember/0 to-ember/0 group-hover:from-ember/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
            
            <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate/10 text-midnight group-hover:bg-ember/10 group-hover:text-ember transition-all duration-300 mb-6 group-hover:scale-110 group-hover:rotate-3">
              <feature.icon className="w-6 h-6" />
            </div>
            
            <h3 className="relative text-2xl font-serif text-midnight mb-3">
              {feature.title}
            </h3>
            
            <p className="relative text-base text-slate">
              {feature.description}
            </p>
          </article>
        </MotionWrapper>
      ))}
    </div>
  )
}
