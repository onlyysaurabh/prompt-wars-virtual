'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MotionWrapper } from '@/components/motion-wrapper'
import { Insight } from '@/lib/types'

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const priorityGlow = insight.priority === 'high'
    ? 'hover:shadow-[0_12px_40px_rgba(245,158,11,0.15)]'
    : insight.priority === 'medium'
    ? 'hover:shadow-[0_12px_40px_rgba(5,150,105,0.12)]'
    : 'hover:shadow-[0_12px_40px_rgba(148,163,184,0.1)]'

  const priorityBorder = insight.priority === 'high'
    ? 'border-l-ember'
    : insight.priority === 'medium'
    ? 'border-l-sage'
    : 'border-l-slate/30'

  return (
    <MotionWrapper key={index} delay={0.2 + index * 0.1} hover>
      <Card className={`group bg-white/5 backdrop-blur-md border-l-4 ${priorityBorder} border-y-white/10 border-r-white/10 hover:bg-white/[0.08] transition-all duration-300 ${priorityGlow} hover:-translate-y-0.5 cursor-default`}>
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
    </MotionWrapper>
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
        <MotionWrapper delay={0.2}>
          <div className="rounded-xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 animate-border-glow">
            <p className="text-slate">Loading insights...</p>
          </div>
        </MotionWrapper>
      ) : insights.length === 0 ? (
        <MotionWrapper delay={0.2} hover>
          <div className="rounded-xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 hover:bg-white/[0.08] transition-all duration-300">
            <p className="text-slate">No insights available yet. Try logging more actions!</p>
          </div>
        </MotionWrapper>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
