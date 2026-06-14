import { useState, useEffect } from 'react'

export function useCarbonActions() {
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActions = async () => {
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
  }

  useEffect(() => {
    fetchActions()
  }, [])

  return { actions, loading, refetch: fetchActions }
}
