'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogTransportForm } from '@/components/forms/log-transport'
import { LogEnergyForm } from '@/components/forms/log-energy'
import { LogFoodForm } from '@/components/forms/log-food'
import { LogShoppingForm } from '@/components/forms/log-shopping'
import { MotionWrapper } from '@/components/motion-wrapper'

import { CarbonAction } from '@/lib/types'

export default function ActionsPage() {
  const [actions, setActions] = useState<CarbonAction[]>([])

  const fetchActions = useCallback(async () => {
    try {
      const res = await fetch('/api/actions')
      if (res.ok) {
        const json = await res.json()
        setActions(json.data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchActions()
  }, [fetchActions])

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <MotionWrapper delay={0.1}>
        <h1 className="text-4xl sm:text-5xl font-serif text-paper">Log Actions</h1>
        <p className="text-lg text-slate mt-2">Record your daily carbon-emitting activities.</p>
      </MotionWrapper>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <MotionWrapper delay={0.2} className="lg:col-span-2">
          <Tabs defaultValue="transport" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="transport" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate">Transport</TabsTrigger>
              <TabsTrigger value="energy" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate">Energy</TabsTrigger>
              <TabsTrigger value="food" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate">Food</TabsTrigger>
              <TabsTrigger value="shopping" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate">Shopping</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="transport">
                <Card className="backdrop-blur-lg bg-white/5 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Transport</CardTitle>
                    <CardDescription className="text-slate">Record your travels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogTransportForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="energy">
                <Card className="backdrop-blur-lg bg-white/5 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Energy</CardTitle>
                    <CardDescription className="text-slate">Record home energy usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogEnergyForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food">
                <Card className="backdrop-blur-lg bg-white/5 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Food</CardTitle>
                    <CardDescription className="text-slate">Record your diet footprint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogFoodForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shopping">
                <Card className="backdrop-blur-lg bg-white/5 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Shopping</CardTitle>
                    <CardDescription className="text-slate">Record your purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogShoppingForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </MotionWrapper>

        <MotionWrapper delay={0.3} className="space-y-4">
          <h2 className="text-xl font-serif text-paper">Recent Actions</h2>
          {actions.length === 0 ? (
            <p className="text-slate text-sm">No actions logged yet.</p>
          ) : (
            <div className="space-y-3">
              {actions.map((action, i) => (
                <MotionWrapper key={action.id} delay={0.4 + i * 0.1}>
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-ember/30 transition-colors">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium capitalize text-paper">{action.subcategory}</p>
                        <p className="text-sm text-slate capitalize">{action.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold font-mono text-ember">{action.co2_kg?.toFixed(2)} <span className="text-xs">kg</span></p>
                        <p className="text-xs text-slate">
                          {new Date(action.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              ))}
            </div>
          )}
        </MotionWrapper>
      </div>
    </div>
  )
}
