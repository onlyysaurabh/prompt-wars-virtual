'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { shoppingActionSchema } from '@/lib/validators/action'
import { toast } from 'sonner'
import { useState } from 'react'

type FormData = z.infer<typeof shoppingActionSchema>

export function LogShoppingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(shoppingActionSchema),
    defaultValues: {
      category: 'shopping',
      subcategory: 'clothing',
      amount: 0,
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
      toast.success('Shopping action logged successfully!')
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
        <Label>Purchase Category</Label>
        <Select 
          value={form.watch('subcategory')} 
          onValueChange={(val) => form.setValue('subcategory', val as 'clothing' | 'electronics' | 'furniture' | 'other')}
        >
          <SelectTrigger><SelectValue placeholder="Select purchase category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Amount Spent (USD)</Label>
        <Input 
          type="number" 
          step="0.01"
          {...form.register('amount', { valueAsNumber: true })} 
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging...' : 'Log Shopping'}
      </Button>
    </form>
  )
}
