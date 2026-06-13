'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { foodActionSchema } from '@/lib/validators/action'
import { toast } from 'sonner'
import { useState } from 'react'

type FormData = z.infer<typeof foodActionSchema>

export function LogFoodForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(foodActionSchema),
    defaultValues: {
      category: 'food',
      subcategory: 'meat_beef',
      amount: 0,
      unit: 'servings',
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
      toast.success('Food action logged successfully!')
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
        <Label>Food Type</Label>
        <Select 
          value={form.watch('subcategory')} 
          onValueChange={(val) => form.setValue('subcategory', val as 'meat_beef' | 'meat_chicken' | 'meat_pork' | 'dairy' | 'vegetables' | 'grains' | 'processed' | 'dining_out')}
        >
          <SelectTrigger><SelectValue placeholder="Select food type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="meat_beef">Beef</SelectItem>
            <SelectItem value="meat_chicken">Chicken</SelectItem>
            <SelectItem value="meat_pork">Pork</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="processed">Processed Food</SelectItem>
            <SelectItem value="dining_out">Dining Out</SelectItem>
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
            onValueChange={(val) => form.setValue('unit', val as 'kg' | 'servings' | 'meals')}
          >
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="servings">Servings</SelectItem>
              <SelectItem value="meals">Meals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging...' : 'Log Food'}
      </Button>
    </form>
  )
}
