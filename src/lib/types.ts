import { z } from 'zod'
import { carbonActionSchema } from './validators/action'

export type CarbonAction = z.infer<typeof carbonActionSchema> & {
  id: string
  user_id: string
  co2_kg: number
  created_at: string
}

export type Goal = {
  id: string
  user_id: string
  goal_type: 'monthly_target' | 'category_limit' | 'streak'
  target_co2_kg: number
  target_category?: string
  active: boolean
  created_at: string
}

export type Insight = {
  id?: string
  priority: 'high' | 'medium' | 'low'
  type: string
  title: string
  description: string
  impact?: string
}
