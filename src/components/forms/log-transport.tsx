'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { transportActionSchema } from '@/lib/validators/action'
import { toast } from 'sonner'
import { useState } from 'react'

type FormData = z.input<typeof transportActionSchema>

export function LogTransportForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(transportActionSchema),
    defaultValues: {
      category: 'transport',
      subcategory: 'car',
      distance_km: 0,
      passengers: 1,
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to log action')
      toast.success('Transport action logged successfully!')
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to log action')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Mode of Transport</Label>
        <Select 
          value={form.watch('subcategory')} 
          onValueChange={(val) => form.setValue('subcategory', val as 'flight' | 'car' | 'bus' | 'train' | 'bike' | 'walk')}
        >
          <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="bus">Bus</SelectItem>
            <SelectItem value="train">Train</SelectItem>
            <SelectItem value="flight">Flight</SelectItem>
            <SelectItem value="bike">Bike</SelectItem>
            <SelectItem value="walk">Walk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Distance (km)</Label>
        <Input 
          type="number" 
          step="0.1"
          {...form.register('distance_km', { valueAsNumber: true })} 
        />
        {form.formState.errors.distance_km && (
          <p className="text-sm text-red-500">{form.formState.errors.distance_km.message}</p>
        )}
      </div>

      {form.watch('subcategory') === 'car' && (
        <div className="space-y-2">
          <Label>Passengers</Label>
          <Input 
            type="number" 
            {...form.register('passengers', { valueAsNumber: true })} 
          />
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging...' : 'Log Transport'}
      </Button>
    </form>
  )
}
