import { z } from 'zod'

export const transportActionSchema = z.object({
  category: z.literal('transport'),
  subcategory: z.enum(['flight', 'car', 'bus', 'train', 'bike', 'walk']),
  distance_km: z.number().positive().max(50000),
  passengers: z.number().int().positive().max(9).default(1),
  vehicle_model: z.string().optional(),
  departure_airport: z.string().length(3).optional(),
  arrival_airport: z.string().length(3).optional(),
})

export const energyActionSchema = z.object({
  category: z.literal('energy'),
  subcategory: z.enum(['electricity', 'gas', 'heating_oil']),
  amount: z.number().positive().max(100000),
  unit: z.enum(['kwh', 'liters', 'therms']),
  period: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
})

export const foodActionSchema = z.object({
  category: z.literal('food'),
  subcategory: z.enum(['meat_beef', 'meat_chicken', 'meat_pork', 'dairy', 'vegetables', 'grains', 'processed', 'dining_out']),
  amount: z.number().positive().max(1000),
  unit: z.enum(['kg', 'servings', 'meals']),
})

export const carbonActionSchema = z.discriminatedUnion('category', [
  transportActionSchema,
  energyActionSchema,
  foodActionSchema,
])
