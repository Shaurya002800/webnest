import { describe, expect, it } from 'vitest'
import { getCherryGardenState } from './cherry-garden'

describe('cherry garden choreography', () => {
  it('clamps progress and moves from the cafe threshold to the garden exit', () => {
    expect(getCherryGardenState(-1).progress).toBe(0)
    expect(getCherryGardenState(0).phase).toBe('doorway')
    expect(getCherryGardenState(.5).phase).toBe('journeys')
    expect(getCherryGardenState(1).phase).toBe('apartment-exit')
    expect(getCherryGardenState(2).progress).toBe(1)
  })

  it('walks through all six business journeys in order', () => {
    const samples = [.18, .3, .42, .54, .66, .78].map(getCherryGardenState)
    expect(samples.map((sample) => sample.activeJourney)).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('builds petal movement after the doorway and calms it at the apartment exit', () => {
    expect(getCherryGardenState(0).petalIntensity).toBe(0)
    expect(getCherryGardenState(.45).petalIntensity).toBeGreaterThan(.85)
    expect(getCherryGardenState(1).petalIntensity).toBeLessThan(.35)
  })

  it('continues the butterfly from the coffee rear door to a branch and toward the next building', () => {
    const doorway = getCherryGardenState(0).butterfly
    const branch = getCherryGardenState(.56).butterfly
    const exit = getCherryGardenState(1).butterfly
    expect(doorway.x).toBe(94)
    expect(doorway.y).toBe(23)
    expect(branch.x).toBeLessThan(doorway.x)
    expect(branch.y).toBeGreaterThanOrEqual(20)
    expect(branch.y).toBeLessThanOrEqual(38)
    expect(branch.scale).toBeGreaterThan(doorway.scale)
    expect(exit.x).toBeGreaterThan(branch.x)
    expect(exit.opacity).toBe(0)
  })

  it('pushes through the cafe door before settling into the Figma street composition', () => {
    const entry = getCherryGardenState(0).camera
    const framed = getCherryGardenState(.5).camera
    expect(entry.z).toBeGreaterThan(framed.z)
    expect(framed.targetY).toBeGreaterThan(entry.targetY)
    expect(getCherryGardenState(.5).contentOpacity).toBe(1)
  })
})
