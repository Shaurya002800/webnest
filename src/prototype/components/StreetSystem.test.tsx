import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StreetSystem } from './StreetSystem'

describe('interactive street system', () => {
  it('renders a real-time 3D street and all six connected stages', () => {
    render(<StreetSystem reducedMotion={false} />)
    expect(screen.getByRole('region', { name: /connected online business system/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /interactive 3d new york-inspired street/i })).toBeInTheDocument()
    expect(document.querySelector('img[src="/assets/generated/street-system-nyc.png"]')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(6)
    expect(screen.getByRole('link', { name: /explore what webnest builds/i })).toHaveAttribute('href', '#services')
  })

  it('lets a visitor inspect a waypoint without scrolling', () => {
    render(<StreetSystem reducedMotion={false} />)
    const automate = screen.getByRole('button', { name: /05 automate/i })
    fireEvent.click(automate)
    expect(automate).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/follow-ups · reminders · ai workflows/i)).toBeVisible()
  })
})
