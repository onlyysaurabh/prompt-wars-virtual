'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-display-lg font-display text-ink">Insights</h1>
        <p className="text-body-md text-ink-secondary">Understand and reduce your carbon footprint.</p>
      </div>
      
      {loading ? (
        <div className="text-ink-secondary">Loading insights...</div>
      ) : insights.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
          <p className="text-ink-secondary">No insights available yet. Try logging more actions!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant={
                    insight.priority === 'high' ? 'destructive' :
                    insight.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {insight.type}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body-md">{insight.description}</CardDescription>
                {insight.impact && (
                  <p className="mt-4 text-sm font-medium text-primary">
                    💡 {insight.impact}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
