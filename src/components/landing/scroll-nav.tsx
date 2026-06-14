'use client'

import { useEffect, useState } from 'react'

interface ScrollNavProps {
  sections: { id: string; label: string }[]
}

export function ScrollNav({ sections }: ScrollNavProps) {
  const [activeSection, setActiveSection] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-end w-12 h-6 cursor-pointer"
            aria-label={`Scroll to ${label}`}
          >
            <span
              className={`absolute right-8 px-3 py-1.5 rounded-full bg-midnight/80 backdrop-blur-md text-xs font-medium text-paper transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg
                ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}
            >
              {label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-3 h-3 bg-ember ring-4 ring-ember/20 shadow-glow-ember' 
                  : 'w-2 h-2 bg-slate/40 group-hover:bg-slate group-hover:scale-125'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
