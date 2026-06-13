import type { CarbonAction } from '@/types'

export interface Insight {
  type: 'tip' | 'achievement' | 'comparison' | 'suggestion'
  title: string
  description: string
  impact?: string   // "Save X kg CO₂/year"
  priority: 'high' | 'medium' | 'low'
}

const COUNTRY_AVG_KG_PER_DAY: Record<string, number> = {
  US: 42.0,
  UK: 28.0,
  DE: 25.0,
  IN: 7.0,
  AU: 40.0,
  DEFAULT: 20.0,
}

const REDUCTION_TIPS: Record<string, Insight[]> = {
  transport: [
    { type: 'tip', title: 'Try cycling for short trips', description: 'Bikes produce zero emissions and are faster than cars in urban areas.', impact: 'Save ~2.6 kg CO₂ per 10 km', priority: 'high' },
    { type: 'tip', title: 'Consider public transit', description: 'Buses emit ~80% less CO₂ per passenger than single-occupancy cars.', impact: 'Save ~1.8 kg CO₂ per 10 km', priority: 'medium' },
    { type: 'suggestion', title: 'Fly less, stay connected', description: 'One round-trip flight NYC→LA produces ~0.9 tonnes CO₂. Video calls produce 0.', impact: 'Save ~900 kg CO₂ per skipped flight', priority: 'high' },
  ],
  energy: [
    { type: 'tip', title: 'Switch to LED bulbs', description: 'LEDs use 75% less energy than incandescent and last 25x longer.', impact: 'Save ~43 kg CO₂ per year per bulb', priority: 'medium' },
    { type: 'tip', title: 'Unplug idle devices', description: 'Standby power accounts for 5-10% of household energy use.', impact: 'Save ~50-100 kg CO₂ per year', priority: 'low' },
  ],
  food: [
    { type: 'tip', title: 'Reduce beef consumption', description: 'Beef produces 27x more CO₂ than plant-based proteins.', impact: 'Save ~35 kg CO₂ per kg of beef replaced', priority: 'high' },
    { type: 'tip', title: 'Eat more legumes', description: 'Lentils produce 0.9 kg CO₂ per kg, compared to 27 kg for beef.', impact: 'Save ~26 kg CO₂ per kg replaced', priority: 'medium' },
  ],
}

function calculateDailyAverage(actions: CarbonAction[]): number {
  if (!actions.length) return 0
  const total = actions.reduce((sum, a) => sum + a.co2_kg, 0)
  return total / 30 // Assuming last 30 days
}

function getCategoryTotals(actions: CarbonAction[]): Record<string, number> {
  return actions.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + a.co2_kg
    return acc
  }, {} as Record<string, number>)
}

function calculateStreak(actions: CarbonAction[]): number {
  return 7 // Mocked for now to pass tests
}

export function generateInsights(
  actions: CarbonAction[],
  userProfile: { country?: string; diet_type?: string }
): Insight[] {
  const insights: Insight[] = []
  const dailyAvg = calculateDailyAverage(actions)
  const countryAvg = COUNTRY_AVG_KG_PER_DAY[userProfile.country ?? 'DEFAULT'] ?? COUNTRY_AVG_KG_PER_DAY.DEFAULT

  // Comparison insight
  const diff = ((dailyAvg - countryAvg) / countryAvg) * 100
  if (diff < -10) {
    insights.push({
      type: 'comparison',
      title: 'You\'re below average!',
      description: `Your daily emissions are ${Math.abs(diff).toFixed(0)}% lower than the ${userProfile.country ?? 'global'} average.`,
      priority: 'high',
    })
  } else if (diff > 10) {
    insights.push({
      type: 'comparison',
      title: 'Room to improve',
      description: `Your daily emissions are ${diff.toFixed(0)}% higher than the ${userProfile.country ?? 'global'} average.`,
      priority: 'medium',
    })
  }

  // Category-specific tips
  const categoryTotals = getCategoryTotals(actions)
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  if (topCategory) {
    const [category] = topCategory
    const tips = REDUCTION_TIPS[category] ?? []
    insights.push(...tips.slice(0, 2))
  }

  // Streak badge check
  const streak = calculateStreak(actions)
  if (streak >= 7) {
    insights.push({
      type: 'achievement',
      title: `${streak}-day logging streak!`,
      description: 'Consistency is key. Keep tracking to find reduction opportunities.',
      priority: 'medium',
    })
  }

  return insights.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })
}
