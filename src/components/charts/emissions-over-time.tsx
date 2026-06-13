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
          <XAxis dataKey="date" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(250,250,249,0.1)', color: '#FAFAF9' }} 
            itemStyle={{ color: '#F59E0B' }}
          />
          <Line
            type="monotone"
            dataKey="co2_kg"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 4, fill: '#F59E0B' }}
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
