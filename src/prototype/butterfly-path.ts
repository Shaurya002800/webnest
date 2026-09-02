export type FlightPoint = { x: number; y: number; rotation: number }

export function getHeroButterflyPoint(rawProgress: number): FlightPoint {
  const progress = Math.max(0, Math.min(1, rawProgress))
  const eased = 1 - Math.pow(1 - progress, 2)
  return {
    x: 69 + eased * 11,
    y: 36 - eased * 3 + Math.sin(progress * Math.PI * 4) * 1.4,
    rotation: -12 + Math.sin(progress * Math.PI * 2) * 8,
  }
}

