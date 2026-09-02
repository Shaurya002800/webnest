import { describe, expect, it } from 'vitest'
import { getCoffeeShopState } from './coffee-shop'

describe('coffee shop choreography', () => {
  it('crosses the threshold, tells the service story and leaves through the rear door', () => {
    expect(getCoffeeShopState(0).phase).toBe('threshold')
    expect(getCoffeeShopState(.5).phase).toBe('service')
    expect(getCoffeeShopState(1).phase).toBe('rear-door')
  })

  it('activates the four service pillars in order', () => {
    const samples = [.18, .38, .58, .78].map(getCoffeeShopState)
    expect(samples.map((sample) => sample.activePillar)).toEqual([0, 1, 2, 3])
  })

  it('clamps progress and keeps content visible through the service phase', () => {
    expect(getCoffeeShopState(-1).progress).toBe(0)
    expect(getCoffeeShopState(2).progress).toBe(1)
    expect(getCoffeeShopState(.5).contentOpacity).toBe(1)
  })

  it('moves the butterfly from the street door to the coffee bar and out the rear door', () => {
    const threshold = getCoffeeShopState(0).butterfly
    const bar = getCoffeeShopState(.5).butterfly
    const exit = getCoffeeShopState(1).butterfly
    expect(bar.y).toBeGreaterThan(threshold.y)
    expect(bar.scale).toBeGreaterThan(threshold.scale)
    expect(exit.x).toBeGreaterThan(bar.x)
    expect(exit.y).toBeLessThan(bar.y)
    expect(exit.opacity).toBe(0)
  })
})
