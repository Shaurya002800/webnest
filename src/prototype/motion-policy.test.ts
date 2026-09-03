import { describe, expect, it } from 'vitest'
import { getMotionPolicy } from './motion-policy'

describe('motion policy', () => {
  it.each([
    [{ width: 1440, reducedMotion: false, lowPower: false }, 'full'],
    [{ width: 900, reducedMotion: false, lowPower: false }, 'lite'],
    [{ width: 390, reducedMotion: false, lowPower: false }, 'minimal'],
    [{ width: 1440, reducedMotion: false, lowPower: true }, 'minimal'],
    [{ width: 1440, reducedMotion: true, lowPower: false }, 'still'],
  ] as const)('selects the expected tier', (input, expected) => {
    expect(getMotionPolicy(input).tier).toBe(expected)
  })

  it('keeps scrolling native even at the full cinematic tier', () => {
    expect(getMotionPolicy({ width: 1440, reducedMotion: false, lowPower: false }).smoothScroll).toBe(false)
  })
})
