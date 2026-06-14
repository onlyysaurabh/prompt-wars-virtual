'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogTransportForm } from '@/components/forms/log-transport'
import { LogEnergyForm } from '@/components/forms/log-energy'
import { LogFoodForm } from '@/components/forms/log-food'
import { LogShoppingForm } from '@/components/forms/log-shopping'
import { MotionWrapper } from '@/components/motion-wrapper'
import { Activity } from 'lucide-react'

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
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 p-1 relative">
              <TabsTrigger value="transport" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate data-[state=active]:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300">Transport</TabsTrigger>
              <TabsTrigger value="energy" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate data-[state=active]:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300">Energy</TabsTrigger>
              <TabsTrigger value="food" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate data-[state=active]:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300">Food</TabsTrigger>
              <TabsTrigger value="shopping" className="data-[state=active]:bg-ember data-[state=active]:text-midnight text-slate data-[state=active]:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300">Shopping</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="transport" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:duration-200">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Transport</CardTitle>
                    <CardDescription className="text-slate">Record your travels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogTransportForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="energy" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:duration-200">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Energy</CardTitle>
                    <CardDescription className="text-slate">Record home energy usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogEnergyForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:duration-200">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Log Food</CardTitle>
                    <CardDescription className="text-slate">Record your diet footprint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogFoodForm onSuccess={fetchActions} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shopping" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:duration-200">
                <Card>
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
            <div className="rounded-xl flex flex-col items-center justify-center p-8 border border-white/10 animate-border-glow text-center">
              <Activity className="w-8 h-8 text-slate mb-3 opacity-50" />
              <p className="text-slate text-sm">No actions logged yet.</p>
            </div>
          ) : (
            <div className="relative group">
              {/* Top scroll indicator */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-midnight to-transparent z-10 pointer-events-none opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <MotionWrapper stagger delay={0.4} className="space-y-3">
                  {actions.map((action) => (
                    <Card key={action.id} className="hover:border-ember/30 hover:shadow-glow-ember cursor-default">
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
                  ))}
                </MotionWrapper>
              </div>

              {/* Bottom scroll indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-midnight to-transparent z-10 pointer-events-none" />
            </div>
          )}
        </MotionWrapper>
      </div>
    </div>
  )
}
