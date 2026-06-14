'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const goalSchema = z.object({
  goal_type: z.enum(['monthly_target', 'category_limit', 'streak']),
  target_co2_kg: z.number().positive('Target must be positive'),
})

type GoalFormData = z.infer<typeof goalSchema>

export function CreateGoalForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, setValue, watch } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { goal_type: 'monthly_target' }
  })

  const onSubmit = async (data: GoalFormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_type: data.goal_type,
          target_co2_kg: data.target_co2_kg,
        }),
      })
      if (!res.ok) throw new Error('Failed to create goal')
      toast.success('Goal created successfully!')
      reset()
      onSuccess?.()
    } catch (e) {
      toast.error('Failed to create goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Goal Type</Label>
        <Select 
          value={watch('goal_type')} 
          onValueChange={(val) => setValue('goal_type', val as 'monthly_target' | 'category_limit' | 'streak')}
        >
          <SelectTrigger><SelectValue placeholder="Select goal type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly_target">Monthly Target</SelectItem>
            <SelectItem value="category_limit">Category Limit</SelectItem>
            <SelectItem value="streak">Streak</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Target CO₂ Reduction (kg)</Label>
        <Input required type="number" {...register('target_co2_kg', { valueAsNumber: true })} placeholder="100" />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Goal'}
      </Button>
    </form>
  )
}
