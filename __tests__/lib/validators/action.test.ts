import { describe, it, expect } from 'vitest'
import { transportActionSchema } from '@/lib/validators/action'

describe('transportActionSchema', () => {
  it('should accept valid flight data', () => {
    const result = transportActionSchema.safeParse({
      category: 'transport',
      subcategory: 'flight',
      distance_km: 5500,
      passengers: 1,
      departure_airport: 'JFK',
      arrival_airport: 'LHR',
    })
    expect(result.success).toBe(true)
  })

  it('should reject negative distance', () => {
    const result = transportActionSchema.safeParse({
      category: 'transport',
      subcategory: 'car',
      distance_km: -10,
      passengers: 1,
    })
    expect(result.success).toBe(false)
  })
})
