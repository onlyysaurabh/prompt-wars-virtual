'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateGoalForm } from '@/components/forms/create-goal'
import { Progress } from '@/components/ui/progress'
import { MotionWrapper } from '@/components/motion-wrapper'
import { Goal } from '@/lib/types'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch('/api/goals')
      if (res.ok) {
        const json = await res.json()
        setGoals(json.data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchGoals()
  }, [fetchGoals])

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <MotionWrapper delay={0.1}>
        <h1 className="text-4xl sm:text-5xl font-serif text-paper">Goals</h1>
        <p className="text-lg text-slate mt-2">Set and track your carbon reduction targets.</p>
      </MotionWrapper>
      
      <div className="grid md:grid-cols-3 gap-8">
        <MotionWrapper delay={0.2} className="md:col-span-1">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-paper">Create Goal</CardTitle>
              <CardDescription className="text-slate">Set a new reduction target</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateGoalForm onSuccess={fetchGoals} />
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.3} className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-serif text-paper">Your Goals</h2>
          {goals.length === 0 ? (
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10 text-center text-slate">
              No active goals. Set one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, i) => {
                // Mock progress calculation for now
                const progressValue = 0
                const percent = Math.min(100, Math.round((progressValue / goal.target_co2_kg) * 100) || 0)
                
                return (
                  <MotionWrapper key={goal.id} delay={0.4 + i * 0.1}>
                    <Card className="bg-white/5 backdrop-blur-md border-white/10">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-serif text-paper capitalize">{goal.goal_type.replace('_', ' ')}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${goal.active ? 'bg-sage/20 text-sage border border-sage/30' : 'bg-slate/10 text-slate border border-slate/20'}`}>
                            {goal.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <CardDescription className="text-slate">Target: {goal.target_co2_kg} kg CO₂</CardDescription>

                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate">{progressValue} kg reduced</span>
                            <span className="text-ember font-mono font-bold">{percent}%</span>
                          </div>
                          <Progress value={percent} className="h-2 bg-slate/20" />
                        </div>
                      </CardContent>
                    </Card>
                  </MotionWrapper>
                )
              })}
            </div>
          )}
        </MotionWrapper>
      </div>
    </div>
  )
}
