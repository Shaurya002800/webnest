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
    expect(document.querySelector('.coffee-shop__entry-plate')).toHaveAttribute('src', '/assets/reference/coffee-shop-entry-morning.jpg')
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

  it('uses a daylight interior palette while preserving readable warm materials', () => {
    const profile = getCoffeeShopLightingProfile('morning')
    expect(profile.background).toBe(0xe8dfd1)
    expect(profile.ambientIntensity).toBeGreaterThan(3)
    expect(profile.wood).toBeGreaterThan(0x35180d)
    expect(profile.accentIntensity).toBeLessThan(profile.practicalIntensity)
  })
})
