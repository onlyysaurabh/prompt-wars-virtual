'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const profileSchema = z.object({
  display_name: z.string().optional(),
  country: z.string().optional(),
  household_size: z.coerce.number().min(1).optional(),
  energy_source: z.string().optional(),
  diet_type: z.string().optional(),
  car_info: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileForm() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const json = await res.json()
        if (json.data) reset(json.data)
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      toast.success('Profile updated successfully!')
    } catch (e) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Display Name</Label>
        <Input {...register('display_name')} placeholder="Your Name" />
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <Input {...register('country')} placeholder="e.g. USA, UK" />
      </div>

      <div className="space-y-2">
        <Label>Household Size</Label>
        <Input type="number" {...register('household_size')} placeholder="1" />
      </div>

      <div className="space-y-2">
        <Label>Primary Energy Source</Label>
        <Select value={watch('energy_source')} onValueChange={(v) => setValue('energy_source', v)}>
          <SelectTrigger><SelectValue placeholder="Select energy source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid Electricity</SelectItem>
            <SelectItem value="renewable">Renewable / Solar</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Diet Type</Label>
        <Select value={watch('diet_type')} onValueChange={(v) => setValue('diet_type', v)}>
          <SelectTrigger><SelectValue placeholder="Select diet" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="omnivore">Omnivore</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="pescatarian">Pescatarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Primary Vehicle (Optional)</Label>
        <Input {...register('car_info')} placeholder="e.g. 2018 Toyota Camry" />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
