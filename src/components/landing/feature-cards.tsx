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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, i) => (
        <MotionWrapper
          key={feature.title}
          delay={i * 0.15}
          whileInView
          hover
        >
          <article className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 hover:border-sage/20 hover:bg-white/80 transition-all duration-500 group hover:shadow-[0_20px_40px_-15px_rgba(10,36,23,0.1)] h-full overflow-hidden">
            {/* Subtle glow on hover */}
            <div className="absolute -inset-1 bg-gradient-to-br from-sage/0 to-sage/0 group-hover:from-sage/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none rounded-3xl" />
            
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage/5 text-midnight group-hover:bg-midnight group-hover:text-ember transition-all duration-500 mb-8 group-hover:scale-110 group-hover:-rotate-3 shadow-sm group-hover:shadow-md">
              <feature.icon className="w-6 h-6 stroke-[1.5]" />
            </div>
            
            <h3 className="relative text-2xl font-serif text-midnight mb-4 tracking-tight group-hover:text-sage transition-colors duration-300">
              {feature.title}
            </h3>
            
            <p className="relative text-sm text-midnight/70 leading-relaxed font-light">
              {feature.description}
            </p>
          </article>
        </MotionWrapper>
      ))}
    </div>
  )
}
