import { useCarbonActions } from './use-carbon-actions'

export function useDashboard() {
  const { actions, loading, refetch } = useCarbonActions()
  
  const totalCo2 = actions.reduce((sum, a) => sum + (a.co2_kg || 0), 0)
  
  return { 
    actions, 
    loading, 
    refetch,
    totalCo2,
    actionsCount: actions.length
  }
}
