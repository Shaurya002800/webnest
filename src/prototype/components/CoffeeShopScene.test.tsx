import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { getCoffeeShopLightingProfile } from './CoffeeShop3D'
import { CoffeeShopScene } from './CoffeeShopScene'

describe('royal coffee shop scene', () => {
  it('renders a real-time 3D interior and the four Figma service pillars', async () => {
    render(<CoffeeShopScene reducedMotion={false} />)
    expect(screen.getByRole('region', { name: /everything your business needs/i })).toBeInTheDocument()
    expect(await screen.findByRole('img', { name: /royal 3d coffee shop interior/i })).toBeInTheDocument()
    expect(document.querySelector('img[src*="coffee-shop"]')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(screen.getByRole('link', { name: /explore all services/i })).toHaveAttribute('href', '#services')
  })

  it('lets a visitor inspect a service pillar without scrolling', () => {
    render(<CoffeeShopScene reducedMotion={false} />)
    const automate = screen.getByRole('button', { name: /03 automate/i })
    fireEvent.click(automate)
    expect(automate).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('WhatsApp Automation')).toBeVisible()
    expect(screen.getByText('AI Assistants')).toBeVisible()
  })

  it('keeps warm practical light stronger than the ember accent', () => {
    const profile = getCoffeeShopLightingProfile()
    expect(profile.exposure).toBeGreaterThanOrEqual(1.18)
    expect(profile.ambientIntensity).toBeGreaterThanOrEqual(2.1)
    expect(profile.practicalIntensity).toBeGreaterThan(profile.accentIntensity)
    expect(profile.shadowMapType).toBe(THREE.PCFShadowMap)
  })
})
