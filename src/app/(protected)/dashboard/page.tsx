import { createServerClient } from '@/lib/supabase/server'
import { EmissionsOverTime } from '@/components/charts/emissions-over-time'
import { CategoryBreakdown } from '@/components/charts/category-breakdown'
import { ComparisonChart } from '@/components/charts/comparison-chart'
import { MotionWrapper } from '@/components/motion-wrapper'

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="group rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)] hover:border-ember/20 transition-all duration-300 hover:-translate-y-0.5 h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ember/0 to-ember/0 group-hover:from-ember/5 group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl" />
      <h3 className="relative text-base font-medium text-slate uppercase tracking-wider">{label}</h3>
      <p className="relative mt-4 text-4xl sm:text-5xl font-mono font-bold text-ember">
        {value}
        {unit && <span className="text-2xl text-ember/70 ml-1">{unit}</span>}
      </p>
    </div>
  )
}

function ChartCard({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <MotionWrapper delay={delay} hover>
      <div className="group rounded-2xl bg-white/5 backdrop-blur-lg p-6 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)] hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5 h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/[0.02] group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl" />
        <h3 className="relative text-lg font-serif text-paper mb-6">{title}</h3>
        <div className="relative">{children}</div>
      </div>
    </MotionWrapper>
  )
}

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
      
      <MotionWrapper stagger delay={0.2} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Footprint" value={totalCo2.toFixed(1)} unit="kg" />
        <StatCard label="Actions Logged" value={String(actionsList.length)} />
        <StatCard label="Daily Average" value={timeData.length > 0 ? (totalCo2 / timeData.length).toFixed(1) : '0'} unit="kg" />
      </MotionWrapper>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Emissions Over Time" delay={0.5}>
          <EmissionsOverTime data={timeData} />
        </ChartCard>
        
        <ChartCard title="Category Breakdown" delay={0.6}>
          <CategoryBreakdown data={categoryData} />
        </ChartCard>
      </div>

      <ChartCard title="Comparison vs Average" delay={0.7}>
        <ComparisonChart data={comparisonData} />
      </ChartCard>
    </div>
  )
}
