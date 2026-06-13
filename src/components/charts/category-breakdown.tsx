'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CHART_COLORS } from '@/lib/utils/charts'

interface Props {
  data: Array<{ name: string; value: number }>
}

export function CategoryBreakdown({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-slate">No data available yet.</div>
  }

  const description = `Pie chart showing breakdown of carbon emissions by category.`

  const getColor = (name: string) => {
    const key = name.toLowerCase() as keyof typeof CHART_COLORS
    return CHART_COLORS[key]?.fill || CHART_COLORS.other.fill
  }

  return (
    <figure role="img" aria-label={description} className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart aria-hidden="true">
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="rgba(250,250,249,0.1)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: unknown) => {
              if (typeof value === 'number') return [`${value.toFixed(1)} kg`, 'CO₂']
              return [`${String(value)} kg`, 'CO₂']
            }} 
            contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(250,250,249,0.1)', color: '#FAFAF9' }} 
            itemStyle={{ color: '#FAFAF9' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">{description}</figcaption>
      <table className="sr-only">
        <caption>Emissions breakdown by category</caption>
        <thead>
          <tr><th>Category</th><th>CO₂ (kg)</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}><td>{d.name}</td><td>{d.value.toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
