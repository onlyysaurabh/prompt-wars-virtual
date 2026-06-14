'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MotionWrapper } from '@/components/motion-wrapper'
import { Insight } from '@/lib/types'

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/insights')
        if (res.ok) {
          const json = await res.json()
          setInsights(json.data || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <MotionWrapper delay={0.1}>
        <h1 className="text-4xl sm:text-5xl font-serif text-paper">Insights</h1>
        <p className="text-lg text-slate mt-2">Understand and reduce your carbon footprint.</p>
      </MotionWrapper>
      
      {loading ? (
        <MotionWrapper delay={0.2} className="text-slate">Loading insights...</MotionWrapper>
      ) : insights.length === 0 ? (
        <MotionWrapper delay={0.2} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10">
          <p className="text-slate">No insights available yet. Try logging more actions!</p>
        </MotionWrapper>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <MotionWrapper key={index} delay={0.2 + index * 0.1}>
              <Card className={`bg-white/5 backdrop-blur-md border-l-4 ${insight.priority === 'high' ? 'border-l-ember' : insight.priority === 'medium' ? 'border-l-sage' : 'border-l-slate/30'} border-y-white/10 border-r-white/10 hover:bg-white/10 transition-colors`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant={
                      insight.priority === 'high' ? 'destructive' :
                      insight.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {insight.type}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 font-serif text-2xl text-paper">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate">{insight.description}</CardDescription>
                  {insight.impact && (
                    <p className="mt-4 text-sm font-medium text-ember">
                      💡 {insight.impact}
                    </p>
                  )}
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      )}
    </div>
  )
}
