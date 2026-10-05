import { describe, expect, it } from 'vitest'
import { getHeroButterflyPoint, getLoaderButterflyPoint, HERO_BUTTERFLY_ORIGIN } from './butterfly-path'

describe('hero butterfly flight band', () => {
  it('moves diagonally while remaining in its stable altitude band', () => {
    const points = Array.from({ length: 21 }, (_, index) => getHeroButterflyPoint(index / 20))
    expect(points[20].x).toBeGreaterThan(points[0].x)
    expect(points.every(({ y }) => y >= 31 && y <= 39)).toBe(true)
  })

  it('ends the loader flight at the exact landing butterfly position', () => {
    expect(getLoaderButterflyPoint(1)).toMatchObject({ x: HERO_BUTTERFLY_ORIGIN.x, y: HERO_BUTTERFLY_ORIGIN.y })
  })

  it('starts the loader butterfly on the left side of the viewport', () => {
    expect(getLoaderButterflyPoint(0)).toMatchObject({ x: 4, y: 82 })
  })
})

