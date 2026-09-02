import { describe, expect, it } from 'vitest'
import { getHeroButterflyPoint } from './butterfly-path'

describe('hero butterfly flight band', () => {
  it('moves diagonally while remaining in its stable altitude band', () => {
    const points = Array.from({ length: 21 }, (_, index) => getHeroButterflyPoint(index / 20))
    expect(points[20].x).toBeGreaterThan(points[0].x)
    expect(points.every(({ y }) => y >= 31 && y <= 39)).toBe(true)
  })
})

