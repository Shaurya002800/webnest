import { describe, expect, it } from 'vitest'
import { getStreetSystemState } from './street-system'

describe('street system choreography', () => {
  it('moves from arrival through the connected system to the coffee-shop exit', () => {
    expect(getStreetSystemState(0).phase).toBe('arrival')
    expect(getStreetSystemState(.5).phase).toBe('system')
    expect(getStreetSystemState(1).phase).toBe('exit')
  })

  it('activates all six system waypoints in order', () => {
    const samples = [0, .18, .35, .5, .68, .86].map(getStreetSystemState)
    expect(samples.map((sample) => sample.activeStep)).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('clamps out-of-range progress and completes the route', () => {
    expect(getStreetSystemState(-1).routeProgress).toBe(0)
    expect(getStreetSystemState(2).routeProgress).toBe(1)
  })

  it('reveals the generated route far enough to meet the active midpoint node', () => {
    const midpoint = getStreetSystemState(.5)
    expect(midpoint.routeProgress).toBeGreaterThan(.65)
    expect(midpoint.routeProgress).toBeLessThan(.7)
  })

  it('guides the butterfly deeper into the street before the exit', () => {
    const arrival = getStreetSystemState(0).butterfly
    const midpoint = getStreetSystemState(.5).butterfly
    const exit = getStreetSystemState(1).butterfly
    expect(midpoint.x).toBeGreaterThan(arrival.x)
    expect(midpoint.y).toBeLessThan(arrival.y)
    expect(exit.scale).toBeLessThan(midpoint.scale)
    expect(exit.opacity).toBe(1)
  })
})
