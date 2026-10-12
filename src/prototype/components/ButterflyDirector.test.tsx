import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getStreetSystemState } from '../street-system'
import { getCoffeeShopState } from '../coffee-shop'
import { getCherryGardenState } from '../cherry-garden'
import { getApartmentFacadeState } from '../apartment-facade'
import { ButterflyDirector } from './ButterflyDirector'

describe('global butterfly director', () => {
  it('hands the butterfly from the building journey into the street', () => {
    const { container } = render(<ButterflyDirector reducedMotion={false} />)
    const butterfly = container.querySelector('.butterfly-director') as HTMLElement
    const state = getStreetSystemState(.5)
    window.dispatchEvent(new CustomEvent('webnest:street-progress', { detail: state }))
    expect(butterfly.dataset.realm).toBe('street-system')
    expect(butterfly.style.getPropertyValue('--flight-x')).toBe(`${state.butterfly.x}vw`)
    expect(butterfly.style.getPropertyValue('--flight-y')).toBe(`${state.butterfly.y}vh`)
  })

  it('hands the same butterfly from the street into the coffee shop', () => {
    const { container } = render(<ButterflyDirector reducedMotion={false} />)
    const butterfly = container.querySelector('.butterfly-director') as HTMLElement
    const state = getCoffeeShopState(.5)
    window.dispatchEvent(new CustomEvent('webnest:coffee-progress', { detail: state }))
    expect(butterfly.dataset.realm).toBe('coffee-shop')
    expect(butterfly.style.getPropertyValue('--flight-x')).toBe(`${state.butterfly.x}vw`)
    expect(butterfly.style.getPropertyValue('--flight-y')).toBe(`${state.butterfly.y}vh`)
  })

  it('hands the same butterfly through the cafe rear door into the cherry branches', () => {
    const { container } = render(<ButterflyDirector reducedMotion={false} />)
    const butterfly = container.querySelector('.butterfly-director') as HTMLElement
    const state = getCherryGardenState(.56)
    window.dispatchEvent(new CustomEvent('webnest:cherry-progress', { detail: state }))
    expect(butterfly.dataset.realm).toBe('cherry-garden')
    expect(butterfly.style.getPropertyValue('--flight-x')).toBe(`${state.butterfly.x}vw`)
    expect(butterfly.style.getPropertyValue('--flight-y')).toBe(`${state.butterfly.y}vh`)
    expect(butterfly.style.getPropertyValue('--flight-opacity')).toBe('1')
  })

  it('hands the same butterfly from the cherry branches into the apartment windows', () => {
    const { container } = render(<ButterflyDirector reducedMotion={false} />)
    const butterfly = container.querySelector('.butterfly-director') as HTMLElement
    const state = getApartmentFacadeState(.56)
    window.dispatchEvent(new CustomEvent('webnest:apartment-progress', { detail: state }))
    expect(butterfly.dataset.realm).toBe('apartment-facade')
    expect(butterfly.style.getPropertyValue('--flight-x')).toBe(`${state.butterfly.x}vw`)
    expect(butterfly.style.getPropertyValue('--flight-y')).toBe(`${state.butterfly.y}vh`)
    expect(butterfly.style.getPropertyValue('--flight-opacity')).toBe('1')
  })

  it('continues the butterfly through the late journey and lets it rest in the final room', () => {
    const { container } = render(<ButterflyDirector reducedMotion={false} />)
    const butterfly = container.querySelector('.butterfly-director') as HTMLElement
    window.dispatchEvent(new CustomEvent('webnest:late-progress', { detail: { realm: 'selected-work', x: 72, y: 24, scale: .32, rotation: -6, opacity: .84 } }))
    expect(butterfly.dataset.realm).toBe('selected-work')
    expect(butterfly.style.getPropertyValue('--flight-x')).toBe('72vw')
    expect(butterfly.style.getPropertyValue('--flight-opacity')).toBe('0.84')

    window.dispatchEvent(new CustomEvent('webnest:late-progress', { detail: { realm: 'final-room', x: 73, y: 58, scale: .3, rotation: 2, opacity: 0 } }))
    expect(butterfly.dataset.realm).toBe('final-room')
    expect(butterfly.style.getPropertyValue('--flight-opacity')).toBe('0')
  })
})
