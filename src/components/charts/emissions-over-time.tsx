'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ date: string; co2_kg: number }>
}

export function EmissionsOverTime({ data }: Props) {
  const description = `Line chart showing carbon emissions over time. ${
    data.length > 1
      ? `Emissions went from ${data[0].co2_kg.toFixed(1)} kg on ${data[0].date} to ${data[data.length - 1].co2_kg.toFixed(1)} kg on ${data[data.length - 1].date}.`
      : 'No data available yet.'
  }`

  return (
    <figure role="img" aria-label={description}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} aria-hidden="true">
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="co2_kg"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">{description}</figcaption>

      {/* Data table alternative for screen readers */}
      <table className="sr-only">
        <caption>Daily carbon emissions</caption>
        <thead>
          <tr><th>Date</th><th>CO₂ (kg)</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}><td>{d.date}</td><td>{d.co2_kg.toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
