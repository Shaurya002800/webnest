import { describe, expect, it } from 'vitest'
import { getExteriorTransitionState } from './exterior-transition'

describe('hero to building transition', () => {
  it('moves through room, window, exterior, and settled building phases', () => {
    expect(getExteriorTransitionState(0).phase).toBe('room')
    expect(getExteriorTransitionState(0.28).phase).toBe('window')
    expect(getExteriorTransitionState(0.58).phase).toBe('exterior')
    expect(getExteriorTransitionState(0.92).phase).toBe('building')
  })

  it('moves the camera forward and releases readable problem content only after settling', () => {
    const samples = [0, .25, .5, .75, 1].map(getExteriorTransitionState)
    expect(samples.map((sample) => sample.cameraScale)).toEqual([1, 1.18, 1.72, 2.22, 2.35])
    expect(samples.slice(0, 4).every((sample) => sample.contentOpacity === 0)).toBe(true)
    expect(samples[4].contentOpacity).toBe(1)
  })

  it('fades the landing copy before the exterior building begins to appear', () => {
    const start = getExteriorTransitionState(0)
    const fading = getExteriorTransitionState(.14)
    const cleared = getExteriorTransitionState(.3)
    const exteriorArrives = getExteriorTransitionState(.48)
    expect(start.heroOpacity).toBe(1)
    expect(fading.heroOpacity).toBeGreaterThan(0)
    expect(fading.heroOpacity).toBeLessThan(1)
    expect(cleared.heroOpacity).toBe(0)
    expect(cleared.buildingOpacity).toBe(0)
    expect(exteriorArrives.buildingOpacity).toBeGreaterThan(0)
  })

  it('sends the butterfly through the window before it settles beside the building copy', () => {
    const beforeWindow = getExteriorTransitionState(.15).butterfly
    const inWindow = getExteriorTransitionState(.42).butterfly
    const outside = getExteriorTransitionState(.58).butterfly
    const settled = getExteriorTransitionState(1).butterfly
    expect(inWindow.x).toBeLessThan(beforeWindow.x)
    expect(outside.x).toBeGreaterThan(inWindow.x)
    expect(outside.scale).toBeLessThan(beforeWindow.scale)
    expect(settled.y).toBeGreaterThan(outside.y)
    expect(settled.x).toBeLessThan(65)
  })
})
