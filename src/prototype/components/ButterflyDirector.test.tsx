import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getStreetSystemState } from '../street-system'
import { ButterflyDirector } from './ButterflyDirector'

describe('global butterfly director', () => {
  it('hands the butterfly from the building journey into the street', () => {
    const { container } = render(<ButterflyDirector reducedMotion={false} />)
    const butterfly = container.querySelector('.butterfly-director') as HTMLElement
    window.dispatchEvent(new CustomEvent('webnest:street-progress', { detail: getStreetSystemState(.5) }))
    expect(butterfly.dataset.realm).toBe('street-system')
    expect(butterfly.style.getPropertyValue('--flight-x')).toBe('60vw')
    expect(butterfly.style.getPropertyValue('--flight-y')).toBe('54vh')
  })
})
