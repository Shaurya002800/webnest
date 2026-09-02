import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StreetSystem } from './StreetSystem'

describe('interactive street system', () => {
  it('keeps the city readable while practical light stays stronger than the magenta accent', async () => {
    const cityModule = await import('./StreetCity3D') as unknown as {
      getStreetLightingProfile?: () => {
        exposure: number
        ambientIntensity: number
        fogDensity: number
        practicalIntensity: number
        accentIntensity: number
      }
    }
    const profile = cityModule.getStreetLightingProfile?.()

    expect(profile).toBeDefined()
    expect(profile?.exposure).toBeGreaterThanOrEqual(1.08)
    expect(profile?.ambientIntensity).toBeGreaterThanOrEqual(2.2)
    expect(profile?.fogDensity).toBeLessThanOrEqual(.01)
    expect(profile?.practicalIntensity).toBeGreaterThan(profile?.accentIntensity ?? Infinity)
  })

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
