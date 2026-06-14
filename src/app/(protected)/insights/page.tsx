'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MotionWrapper } from '@/components/motion-wrapper'
import { Lightbulb } from 'lucide-react'
import { Insight } from '@/lib/types'

function InsightCard({ insight }: { insight: Insight }) {
  const priorityGlow = insight.priority === 'high'
    ? 'hover:shadow-glow-ember'
    : insight.priority === 'medium'
    ? 'hover:shadow-glow-sage'
    : ''

  const priorityBorder = insight.priority === 'high'
    ? 'border-l-ember'
    : insight.priority === 'medium'
    ? 'border-l-sage'
    : 'border-l-slate/30'

  return (
      <Card className={`group border-l-4 ${priorityBorder} ${priorityGlow} cursor-default`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <Badge variant={
              insight.priority === 'high' ? 'destructive' :
              insight.priority === 'medium' ? 'default' : 'secondary'
            } className="group-hover:scale-105 transition-transform duration-200">
              {insight.type}
            </Badge>
          </div>
          <CardTitle className="mt-2 font-serif text-2xl text-paper">{insight.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base text-slate">{insight.description}</CardDescription>
          {insight.impact && (
            <p className="mt-4 text-sm font-medium text-ember group-hover:text-ember/90 transition-colors">
              {insight.impact}
            </p>
          )}
        </CardContent>
      </Card>
  )
}

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
        <MotionWrapper key="loading" delay={0.2}>
          <div className="rounded-xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 animate-border-glow">
            <p className="text-slate">Loading insights...</p>
          </div>
        </MotionWrapper>
      ) : insights.length === 0 ? (
        <MotionWrapper key="empty" delay={0.2}>
          <div className="rounded-xl flex flex-col items-center justify-center p-8 border border-white/10 animate-border-glow text-center">
            <Lightbulb className="w-8 h-8 text-slate mb-3 opacity-50" />
            <p className="text-slate text-sm">No insights available yet. Try logging more actions!</p>
          </div>
        </MotionWrapper>
      ) : (
        <MotionWrapper key="loaded" stagger delay={0.2} className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </MotionWrapper>
      )}
    </div>
  )
}
