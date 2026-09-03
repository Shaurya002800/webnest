export type CherryGardenPhase = 'doorway' | 'journeys' | 'apartment-exit'

export type CherryGardenState = {
  progress: number
  phase: CherryGardenPhase
  activeJourney: number
  contentOpacity: number
  petalIntensity: number
  camera: { x: number; y: number; z: number; targetX: number; targetY: number; targetZ: number }
  butterfly: { x: number; y: number; scale: number; rotation: number; opacity: number }
}

type Keyframe = { progress: number; value: number }

const clamp = (value: number) => Math.max(0, Math.min(1, value))

const interpolate = (progress: number, frames: Keyframe[]) => {
  const p = clamp(progress)
  const nextIndex = frames.findIndex((frame) => frame.progress >= p)
  if (nextIndex <= 0) return frames[0].value
  const previous = frames[nextIndex - 1]
  const next = frames[nextIndex]
  const local = (p - previous.progress) / (next.progress - previous.progress)
  return Number((previous.value + (next.value - previous.value) * local).toFixed(3))
}

const reveal = (progress: number, start: number, end: number) =>
  Number(clamp((progress - start) / (end - start)).toFixed(3))

export function getCherryGardenState(rawProgress: number): CherryGardenState {
  const progress = clamp(rawProgress)
  const phase: CherryGardenPhase = progress < .13 ? 'doorway' : progress < .87 ? 'journeys' : 'apartment-exit'
  const enter = reveal(progress, .035, .12)
  const leave = 1 - reveal(progress, .9, 1)
  const petalArrival = reveal(progress, .04, .22)
  const petalDeparture = 1 - reveal(progress, .82, 1) * .76

  return {
    progress,
    phase,
    activeJourney: Math.min(5, Math.max(0, Math.floor((progress - .12) / .12))),
    contentOpacity: Math.min(enter, leave),
    petalIntensity: Number((petalArrival * petalDeparture).toFixed(3)),
    camera: {
      x: interpolate(progress, [
        { progress: 0, value: 6.8 },
        { progress: .2, value: 3.2 },
        { progress: .56, value: 1.4 },
        { progress: .86, value: -.5 },
        { progress: 1, value: -3.4 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 2.25 },
        { progress: .22, value: 3.4 },
        { progress: .72, value: 3.8 },
        { progress: 1, value: 4.15 },
      ]),
      z: interpolate(progress, [
        { progress: 0, value: 20.5 },
        { progress: .2, value: 15.4 },
        { progress: .5, value: 13.2 },
        { progress: 1, value: 10.8 },
      ]),
      targetX: interpolate(progress, [
        { progress: 0, value: 5.8 },
        { progress: .2, value: .8 },
        { progress: .72, value: -1.4 },
        { progress: 1, value: -5.2 },
      ]),
      targetY: interpolate(progress, [
        { progress: 0, value: 1.6 },
        { progress: .28, value: 3.4 },
        { progress: .72, value: 3.2 },
        { progress: 1, value: 3.6 },
      ]),
      targetZ: interpolate(progress, [
        { progress: 0, value: -2.4 },
        { progress: .28, value: -5.2 },
        { progress: 1, value: -7.8 },
      ]),
    },
    butterfly: {
      x: interpolate(progress, [
        { progress: 0, value: 94 },
        { progress: .14, value: 88 },
        { progress: .34, value: 76 },
        { progress: .56, value: 67 },
        { progress: .76, value: 70 },
        { progress: 1, value: 92 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 23 },
        { progress: .18, value: 27 },
        { progress: .4, value: 34 },
        { progress: .56, value: 31 },
        { progress: .78, value: 27 },
        { progress: 1, value: 21 },
      ]),
      scale: interpolate(progress, [
        { progress: 0, value: .2 },
        { progress: .2, value: .33 },
        { progress: .56, value: .44 },
        { progress: .78, value: .38 },
        { progress: 1, value: .19 },
      ]),
      rotation: interpolate(progress, [
        { progress: 0, value: -18 },
        { progress: .2, value: -7 },
        { progress: .42, value: 9 },
        { progress: .56, value: 1 },
        { progress: .8, value: -8 },
        { progress: 1, value: -17 },
      ]),
      opacity: Math.min(reveal(progress, 0, .08), 1 - reveal(progress, .9, 1)),
    },
  }
}
