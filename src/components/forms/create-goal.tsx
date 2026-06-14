'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function CreateGoalForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          target_co2: Number(data.target_co2),
          deadline: data.deadline,
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
        <Label>Goal Title</Label>
        <Input required {...register('title')} placeholder="e.g. Reduce flight emissions" />
      </div>
      <div className="space-y-2">
        <Label>Target CO₂ Reduction (kg)</Label>
        <Input required type="number" {...register('target_co2')} placeholder="100" />
      </div>
      <div className="space-y-2">
        <Label>Deadline</Label>
        <Input required type="date" {...register('deadline')} />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Goal'}
      </Button>
    </form>
  )
}
