import { generateInsights } from './src/lib/carbon/insights.ts'

console.log('Testing generateInsights with empty data...')
try {
  const actions = []
  const profile = {}
  const insights = generateInsights(actions, profile)
  console.log('Insights generated:', insights)
} catch (e) {
  console.error('Error generating insights:', e)
}
