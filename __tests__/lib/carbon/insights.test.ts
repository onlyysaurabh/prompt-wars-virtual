import { describe, it, expect } from 'vitest'
import { generateInsights } from '@/lib/carbon/insights'

describe('generateInsights', () => {
  it('should return comparison insight when above average', () => {
    const actions = Array.from({ length: 30 }, (_, i) => ({
      id: `action-${i}`,
      user_id: 'user-1',
      unit: 'km',
      quantity: 10,
      subcategory: 'car',
      co2_kg: 50,
      category: 'transport' as const,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    }))

    const insights = generateInsights(actions, { country: 'US' })
    const comparison = insights.find((i: any) => i.type === 'comparison')
    expect(comparison).toBeDefined()
    expect(comparison!.title).toContain('Room to improve')
  })

  it('should return transport tips for heavy transport users', () => {
    const actions = [{ 
      id: 'action-1',
      user_id: 'user-1',
      unit: 'km',
      quantity: 10,
      subcategory: 'car',
      co2_kg: 100, 
      category: 'transport' as const, 
      created_at: new Date().toISOString() 
    }]
    const insights = generateInsights(actions, { country: 'US' })
    expect(insights.some((i: any) => i.title.includes('cycling') || i.title.includes('transit'))).toBe(true)
  })
})
