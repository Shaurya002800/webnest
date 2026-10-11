export type StreetPhase = 'arrival' | 'system' | 'exit'

export type StreetSystemState = {
  phase: StreetPhase
  activeStep: number
  routeProgress: number
  camera: { scale: number; x: number; y: number; tilt: number }
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

export function getStreetSystemState(rawProgress: number): StreetSystemState {
  const progress = clamp(rawProgress)
  const phase: StreetPhase = progress < .14 ? 'arrival' : progress < .88 ? 'system' : 'exit'

  return {
    phase,
    activeStep: Math.min(5, Math.floor(progress * 6)),
    routeProgress: interpolate(progress, [
      { progress: 0, value: 0 },
      { progress: .1, value: .32 },
      { progress: .18, value: .47 },
      { progress: .35, value: .59 },
      { progress: .5, value: .68 },
      { progress: .68, value: .75 },
      { progress: .86, value: .8 },
      { progress: 1, value: 1 },
    ]),
    camera: {
      scale: interpolate(progress, [
        { progress: 0, value: 1.055 },
        { progress: .18, value: 1.025 },
        { progress: .7, value: 1.005 },
        { progress: 1, value: 1.035 },
      ]),
      x: interpolate(progress, [
        { progress: 0, value: -1.1 },
        { progress: .5, value: 0 },
        { progress: 1, value: -.7 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: -1.8 },
        { progress: .72, value: 0 },
        { progress: 1, value: 2 },
      ]),
      tilt: interpolate(progress, [
        { progress: 0, value: -1.5 },
        { progress: .5, value: 0 },
        { progress: 1, value: .8 },
      ]),
    },
    butterfly: {
      x: interpolate(progress, [
        { progress: 0, value: 32 },
        { progress: .18, value: 72 },
        { progress: .42, value: 42 },
        { progress: .64, value: 78 },
        { progress: .82, value: 30 },
        { progress: 1, value: 58 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 68 },
        { progress: .18, value: 39 },
        { progress: .42, value: 61 },
        { progress: .64, value: 31 },
        { progress: .82, value: 57 },
        { progress: 1, value: 31 },
      ]),
      scale: interpolate(progress, [
        { progress: 0, value: .68 },
        { progress: .5, value: .48 },
        { progress: 1, value: .24 },
      ]),
      rotation: interpolate(progress, [
        { progress: 0, value: -12 },
        { progress: .35, value: 8 },
        { progress: .68, value: -7 },
        { progress: 1, value: 12 },
      ]),
      opacity: 1,
    },
  }
}
