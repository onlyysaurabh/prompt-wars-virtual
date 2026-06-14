import { createClient } from '@/lib/supabase/server'
import { EmissionsOverTime } from '@/components/charts/emissions-over-time'
import { CategoryBreakdown } from '@/components/charts/category-breakdown'
import { ComparisonChart } from '@/components/charts/comparison-chart'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: actions } = await supabase
    .from('carbon_actions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const actionsList = actions || []
  
  // Compute totals
  const totalCo2 = actionsList.reduce((sum, a) => sum + (a.co2_kg || 0), 0)
  
  // Category breakdown
  const categoryMap: Record<string, number> = {}
  actionsList.forEach(a => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + (a.co2_kg || 0)
  })
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  // Emissions over time
  const timeMap: Record<string, number> = {}
  actionsList.forEach(a => {
    const d = new Date(a.created_at).toISOString().split('T')[0]
    timeMap[d] = (timeMap[d] || 0) + (a.co2_kg || 0)
  })
  const timeData = Object.entries(timeMap).map(([date, co2_kg]) => ({ date, co2_kg }))

  // Comparison mock data (would normally fetch national avg)
  const comparisonData = categoryData.map(c => ({
    name: c.name,
    you: c.value,
    average: c.value * 1.2 // Mock average is 20% higher
  }))

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-display-lg font-display text-ink">Dashboard</h1>
        <p className="text-body-md text-ink-secondary">Welcome to your carbon footprint tracker.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
          <h3 className="text-body-lg font-medium text-ink">Total Footprint</h3>
          <p className="mt-2 text-display-md text-primary">{totalCo2.toFixed(1)} kg</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
          <h3 className="text-body-lg font-medium text-ink">Actions Logged</h3>
          <p className="mt-2 text-display-md text-primary">{actionsList.length}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
          <h3 className="text-body-lg font-medium text-ink">Daily Average</h3>
          <p className="mt-2 text-display-md text-primary">
            {timeData.length > 0 ? (totalCo2 / timeData.length).toFixed(1) : '0'} kg
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
          <h3 className="text-body-lg font-medium text-ink mb-4">Emissions Over Time</h3>
          <EmissionsOverTime data={timeData} />
        </div>
        
        <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
          <h3 className="text-body-lg font-medium text-ink mb-4">Category Breakdown</h3>
          <CategoryBreakdown data={categoryData} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-card-1 border border-hairline">
        <h3 className="text-body-lg font-medium text-ink mb-4">Comparison vs Average</h3>
        <ComparisonChart data={comparisonData} />
      </div>
    </div>
  )
}
