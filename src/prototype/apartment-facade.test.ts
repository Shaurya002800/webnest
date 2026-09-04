import { describe, expect, it } from 'vitest'
import { getApartmentFacadeState } from './apartment-facade'

describe('apartment façade choreography', () => {
  it('clamps progress and moves from the cherry arrival to the process exit', () => {
    expect(getApartmentFacadeState(-1).progress).toBe(0)
    expect(getApartmentFacadeState(0).phase).toBe('tree-arrival')
    expect(getApartmentFacadeState(.5).phase).toBe('principles')
    expect(getApartmentFacadeState(1).phase).toBe('process-exit')
    expect(getApartmentFacadeState(2).progress).toBe(1)
  })

  it('lights all four principle rooms in order', () => {
    const samples = [.2, .38, .56, .74].map(getApartmentFacadeState)
    expect(samples.map((sample) => sample.activePrinciple)).toEqual([0, 1, 2, 3])
    samples.forEach((sample, index) => {
      expect(sample.roomIntensities[index]).toBe(1)
      expect(sample.roomIntensities.filter((value) => value === 1)).toHaveLength(1)
    })
  })

  it('keeps the butterfly near the building while moving between value rooms', () => {
    const arrival = getApartmentFacadeState(0).butterfly
    const middle = getApartmentFacadeState(.56).butterfly
    const exit = getApartmentFacadeState(1).butterfly
    expect(arrival.x).toBeGreaterThan(80)
    expect(middle.x).toBeGreaterThanOrEqual(42)
    expect(middle.x).toBeLessThanOrEqual(68)
    expect(middle.y).toBeGreaterThanOrEqual(40)
    expect(middle.y).toBeLessThanOrEqual(65)
    expect(exit.y).toBeLessThan(middle.y)
    expect(exit.opacity).toBe(1)
  })
})
