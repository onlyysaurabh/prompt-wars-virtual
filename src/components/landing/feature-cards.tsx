import { 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag 
} from 'lucide-react'

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
      {features.map((feature) => (
        <article
          key={feature.title}
          className="relative bg-white rounded-2xl p-8 border border-slate/20 hover:border-ember/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate/10 text-midnight group-hover:bg-ember/10 group-hover:text-ember transition-colors mb-6">
            <feature.icon className="w-6 h-6" />
          </div>
          
          <h3 className="text-2xl font-serif text-midnight mb-3">
            {feature.title}
          </h3>
          
          <p className="text-base text-slate">
            {feature.description}
          </p>
        </article>
      ))}
    </div>
  )
}
