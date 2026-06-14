'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogTransportForm } from '@/components/forms/log-transport'
import { LogEnergyForm } from '@/components/forms/log-energy'
import { LogFoodForm } from '@/components/forms/log-food'
import { LogShoppingForm } from '@/components/forms/log-shopping'

import { CarbonAction } from '@/lib/types'

export default function ActionsPage() {
  const [actions, setActions] = useState<CarbonAction[]>([])

  const fetchActions = async () => {
    try {
      const res = await fetch('/api/actions')
      if (res.ok) {
        const json = await res.json()
        setActions(json.data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchActions()
  }, [])

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-display-lg font-display text-ink">Log Actions</h1>
      <p className="text-body-md text-ink-secondary">Record your daily carbon-emitting activities.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="transport">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="transport">
                <Card>
                  <CardHeader>
                    <CardTitle>Log Transport</CardTitle>
                    <CardDescription>Record your travels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogTransportForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="energy">
                <Card>
                  <CardHeader>
                    <CardTitle>Log Energy</CardTitle>
                    <CardDescription>Record home energy usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogEnergyForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food">
                <Card>
                  <CardHeader>
                    <CardTitle>Log Food</CardTitle>
                    <CardDescription>Record your diet footprint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogFoodForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shopping">
                <Card>
                  <CardHeader>
                    <CardTitle>Log Shopping</CardTitle>
                    <CardDescription>Record your purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogShoppingForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Actions</h2>
          {actions.length === 0 ? (
            <p className="text-ink-secondary">No actions logged yet.</p>
          ) : (
            <div className="space-y-3">
              {actions.map((action) => (
                <Card key={action.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium capitalize">{action.subcategory}</p>
                      <p className="text-sm text-ink-secondary capitalize">{action.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{action.co2_kg?.toFixed(2)} kg</p>
                      <p className="text-xs text-ink-secondary">
                        {new Date(action.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
