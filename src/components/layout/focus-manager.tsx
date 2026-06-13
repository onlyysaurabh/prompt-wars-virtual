'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function FocusManager() {
  const pathname = usePathname()

  useEffect(() => {
    // Reset focus to body on route change for screen readers
    document.body.focus()
  }, [pathname])

  return null
}
