import { HERO_BUTTERFLY_ORIGIN } from './butterfly-path'

export type ExteriorPhase = 'room' | 'window' | 'exterior' | 'building'

export type ExteriorTransitionState = {
  phase: ExteriorPhase
  cameraScale: number
  heroOpacity: number
  flameOpacity: number
  roomOpacity: number
  buildingOpacity: number
  contentOpacity: number
  notes: [number, number, number]
  butterfly: { x: number; y: number; scale: number; rotation: number }
}

type Keyframe = { progress: number; value: number }

const interpolate = (progress: number, frames: Keyframe[]) => {
  const p = Math.max(0, Math.min(1, progress))
  const nextIndex = frames.findIndex((frame) => frame.progress >= p)
  if (nextIndex <= 0) return frames[0].value
  const previous = frames[nextIndex - 1]
  const next = frames[nextIndex]
  const local = (p - previous.progress) / (next.progress - previous.progress)
  return Number((previous.value + (next.value - previous.value) * local).toFixed(3))
}

const reveal = (progress: number, start: number, end: number) =>
  Number(Math.max(0, Math.min(1, (progress - start) / (end - start))).toFixed(3))

export function getExteriorTransitionState(rawProgress: number): ExteriorTransitionState {
  const progress = Math.max(0, Math.min(1, rawProgress))
  const phase: ExteriorPhase = progress < .12 ? 'room' : progress < .42 ? 'window' : progress < .7 ? 'exterior' : 'building'

  return {
    phase,
    cameraScale: interpolate(progress, [
      { progress: 0, value: 1 },
      { progress: .25, value: 1.18 },
      { progress: .5, value: 1.72 },
      { progress: .75, value: 2.22 },
      { progress: 1, value: 2.35 },
    ]),
    heroOpacity: 1 - reveal(progress, .04, .25),
    flameOpacity: 1 - reveal(progress, .28, .52),
    roomOpacity: 1 - reveal(progress, .42, .66),
    buildingOpacity: reveal(progress, .38, .62),
    contentOpacity: reveal(progress, .78, 1),
    notes: [reveal(progress, .65, .76), reveal(progress, .74, .85), reveal(progress, .84, .95)],
    butterfly: {
      x: interpolate(progress, [{ progress: 0, value: HERO_BUTTERFLY_ORIGIN.x }, { progress: .18, value: 68 }, { progress: .42, value: 61 }, { progress: .58, value: 76 }, { progress: .72, value: 68 }, { progress: 1, value: 58 }]),
      y: interpolate(progress, [{ progress: 0, value: HERO_BUTTERFLY_ORIGIN.y }, { progress: .18, value: 34 }, { progress: .42, value: 28 }, { progress: .58, value: 20 }, { progress: .72, value: 44 }, { progress: 1, value: 53 }]),
      scale: interpolate(progress, [{ progress: 0, value: 1 }, { progress: .18, value: .86 }, { progress: .42, value: .52 }, { progress: .58, value: .42 }, { progress: 1, value: .72 }]),
      rotation: interpolate(progress, [{ progress: 0, value: -8 }, { progress: .18, value: -18 }, { progress: .42, value: 13 }, { progress: .58, value: 7 }, { progress: 1, value: -6 }]),
    },
  }
}
