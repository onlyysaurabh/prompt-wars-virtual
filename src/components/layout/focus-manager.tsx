'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function FocusManager() {
  const pathname = usePathname()

  useEffect(() => {
    const main = document.getElementById('main-content')
    if (main) {
      main.tabIndex = -1
      main.focus({ preventScroll: true })
    }
  }, [pathname])

  return null
}
