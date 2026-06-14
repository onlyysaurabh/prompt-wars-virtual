'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { energyActionSchema } from '@/lib/validators/action'
import { toast } from 'sonner'
import { useState } from 'react'

type FormData = z.infer<typeof energyActionSchema>

export function LogEnergyForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(energyActionSchema),
    defaultValues: {
      category: 'energy',
      subcategory: 'electricity',
      amount: 0,
      unit: 'kwh',
      period: 'monthly',
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
      toast.success('Energy action logged successfully!')
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
        <Label>Type of Energy</Label>
        <Select 
          value={form.watch('subcategory')} 
          onValueChange={(val) => {
            form.setValue('subcategory', val as any)
            if (val === 'electricity') form.setValue('unit', 'kwh')
            if (val === 'gas') form.setValue('unit', 'therms')
            if (val === 'heating_oil') form.setValue('unit', 'liters')
          }}
        >
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="electricity">Electricity</SelectItem>
            <SelectItem value="gas">Natural Gas</SelectItem>
            <SelectItem value="heating_oil">Heating Oil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Amount</Label>
        <div className="flex space-x-2">
          <Input 
            type="number" 
            step="0.1"
            className="flex-1"
            {...form.register('amount', { valueAsNumber: true })} 
          />
          <Select 
            value={form.watch('unit')} 
            onValueChange={(val) => form.setValue('unit', val as any)}
          >
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kwh">kWh</SelectItem>
              <SelectItem value="therms">Therms</SelectItem>
              <SelectItem value="liters">Liters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Period</Label>
        <Select 
          value={form.watch('period')} 
          onValueChange={(val) => form.setValue('period', val as any)}
        >
          <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging...' : 'Log Energy'}
      </Button>
    </form>
  )
}
