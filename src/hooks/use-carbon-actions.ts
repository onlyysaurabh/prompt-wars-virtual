import { useState, useEffect, useCallback } from 'react'
import { CarbonAction } from '@/lib/types'

export function useCarbonActions() {
  const [actions, setActions] = useState<CarbonAction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/actions')
      if (res.ok) {
        const json = await res.json()
        setActions(json.data || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchActions()
  }, [fetchActions])

  return { actions, loading, refetch: fetchActions }
}
