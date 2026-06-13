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
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Energy',
    description: 'Monitor electricity, gas, and heating usage. See how your energy source affects your carbon footprint.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Utensils,
    title: 'Food',
    description: 'Log meals and track the carbon impact of your diet. Compare plant-based vs. meat-heavy meals.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: ShoppingBag,
    title: 'Shopping',
    description: 'Track purchases across clothing, electronics, and furniture. Make informed choices about consumption.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="relative bg-canvas rounded-lg p-8 border border-hairline hover:shadow-card-1 transition-shadow"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} ${feature.color} mb-4`}>
            <feature.icon className="w-6 h-6" />
          </div>
          
          <h3 className="text-display-md font-display text-ink mb-2">
            {feature.title}
          </h3>
          
          <p className="text-body-tabular text-ink-secondary">
            {feature.description}
          </p>
        </article>
      ))}
    </div>
  )
}
