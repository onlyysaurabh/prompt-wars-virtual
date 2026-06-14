'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ name: string; you: number; average: number }>
}

export function ComparisonChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-ink-secondary">No data available yet.</div>
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="you" fill="hsl(var(--primary))" name="You" radius={[4, 4, 0, 0]} />
          <Bar dataKey="average" fill="hsl(var(--muted-foreground))" name="Average" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
