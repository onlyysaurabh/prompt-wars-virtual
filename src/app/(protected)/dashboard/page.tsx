import { createServerClient } from '@/lib/supabase/server'
import { EmissionsOverTime } from '@/components/charts/emissions-over-time'
import { CategoryBreakdown } from '@/components/charts/category-breakdown'
import { ComparisonChart } from '@/components/charts/comparison-chart'
import { MotionWrapper } from '@/components/motion-wrapper'

export default async function DashboardPage() {
  const supabase = await createServerClient()
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
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto">
      <MotionWrapper delay={0.1}>
        <h1 className="text-4xl sm:text-5xl font-serif text-paper">Dashboard</h1>
        <p className="text-lg text-slate mt-2">Welcome to your carbon footprint tracker.</p>
      </MotionWrapper>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MotionWrapper delay={0.2} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <h3 className="text-base font-medium text-slate uppercase tracking-wider">Total Footprint</h3>
          <p className="mt-4 text-4xl sm:text-5xl font-mono font-bold text-ember">{totalCo2.toFixed(1)} <span className="text-2xl text-ember/70">kg</span></p>
        </MotionWrapper>
        <MotionWrapper delay={0.3} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <h3 className="text-base font-medium text-slate uppercase tracking-wider">Actions Logged</h3>
          <p className="mt-4 text-4xl sm:text-5xl font-mono font-bold text-ember">{actionsList.length}</p>
        </MotionWrapper>
        <MotionWrapper delay={0.4} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <h3 className="text-base font-medium text-slate uppercase tracking-wider">Daily Average</h3>
          <p className="mt-4 text-4xl sm:text-5xl font-mono font-bold text-ember">
            {timeData.length > 0 ? (totalCo2 / timeData.length).toFixed(1) : '0'} <span className="text-2xl text-ember/70">kg</span>
          </p>
        </MotionWrapper>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MotionWrapper delay={0.5} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <h3 className="text-lg font-serif text-paper mb-6">Emissions Over Time</h3>
          <EmissionsOverTime data={timeData} />
        </MotionWrapper>
        
        <MotionWrapper delay={0.6} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <h3 className="text-lg font-serif text-paper mb-6">Category Breakdown</h3>
          <CategoryBreakdown data={categoryData} />
        </MotionWrapper>
      </div>

      <MotionWrapper delay={0.7} className="rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <h3 className="text-lg font-serif text-paper mb-6">Comparison vs Average</h3>
        <ComparisonChart data={comparisonData} />
      </MotionWrapper>
    </div>
  )
}
