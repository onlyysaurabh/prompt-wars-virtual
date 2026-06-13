import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { EmissionsOverTime } from '@/components/charts/emissions-over-time'

expect.extend(toHaveNoViolations)

describe('EmissionsOverTime', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <EmissionsOverTime data={[{ date: '2025-01-01', co2_kg: 10 }]} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should include data table for screen readers', () => {
    render(<EmissionsOverTime data={[{ date: '2025-01-01', co2_kg: 10 }]} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
