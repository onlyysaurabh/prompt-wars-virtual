'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateGoalForm } from '@/components/forms/create-goal'
import { Progress } from '@/components/ui/progress'

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([])

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals')
      if (res.ok) {
        const json = await res.json()
        setGoals(json.data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-display-lg font-display text-ink">Goals</h1>
        <p className="text-body-md text-ink-secondary">Set and track your carbon reduction targets.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create Goal</CardTitle>
              <CardDescription>Set a new reduction target</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateGoalForm onSuccess={fetchGoals} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Your Goals</h2>
          {goals.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline text-center text-ink-secondary">
              No active goals. Set one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                // Mock progress calculation for now, or use target_co2 vs current_progress
                const progressValue = goal.current_progress || 0
                const percent = Math.min(100, Math.round((progressValue / goal.target_co2) * 100) || 0)
                
                return (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium capitalize">
                          {goal.status}
                        </span>
                      </div>
                      <CardDescription>Target: {goal.target_co2} kg CO₂ by {new Date(goal.deadline).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{progressValue} kg reduced</span>
                          <span>{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
