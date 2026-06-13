'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '@/lib/utils/charts'

interface Props {
  data: Array<{ name: string; you: number; average: number }>
}

export function ComparisonChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-ink-secondary">No data available yet.</div>
  }

  const description = `Bar chart comparing your emissions to the average.`

  return (
    <figure role="img" aria-label={description} className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} aria-hidden="true">
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="you" fill={CHART_COLORS.transport.fill} name="You" radius={[4, 4, 0, 0]} />
          <Bar dataKey="average" fill={CHART_COLORS.other.fill} name="Average" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">{description}</figcaption>
      <table className="sr-only">
        <caption>Comparison to average by category</caption>
        <thead>
          <tr><th>Category</th><th>You (kg)</th><th>Average (kg)</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}><td>{d.name}</td><td>{d.you.toFixed(1)}</td><td>{d.average.toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
