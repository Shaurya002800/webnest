export type FlightPoint = { x: number; y: number; rotation: number }
export const HERO_BUTTERFLY_ORIGIN = { x: 72, y: 38 }

export function getLoaderButterflyPoint(rawProgress: number): FlightPoint {
  const progress = Math.max(0, Math.min(1, rawProgress))
  const remaining = 1 - progress
  const start = { x: 4, y: 82 }
  const controlOne = { x: 20, y: 82 }
  const controlTwo = { x: 85, y: 100 }
  const x = remaining ** 3 * start.x
    + 3 * remaining ** 2 * progress * controlOne.x
    + 3 * remaining * progress ** 2 * controlTwo.x
    + progress ** 3 * HERO_BUTTERFLY_ORIGIN.x
  const y = remaining ** 3 * start.y
    + 3 * remaining ** 2 * progress * controlOne.y
    + 3 * remaining * progress ** 2 * controlTwo.y
    + progress ** 3 * HERO_BUTTERFLY_ORIGIN.y

  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3)),
    rotation: -8 + Math.sin(progress * Math.PI * 2) * 4,
  }
}

export function getHeroButterflyPoint(rawProgress: number): FlightPoint {
  const progress = Math.max(0, Math.min(1, rawProgress))
  const eased = 1 - Math.pow(1 - progress, 2)
  return {
    x: 69 + eased * 11,
    y: 36 - eased * 3 + Math.sin(progress * Math.PI * 4) * 1.4,
    rotation: -12 + Math.sin(progress * Math.PI * 2) * 8,
  }
}

