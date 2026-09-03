export type ApartmentFacadePhase = 'tree-arrival' | 'principles' | 'process-exit'

export type ApartmentFacadeState = {
  progress: number
  phase: ApartmentFacadePhase
  activePrinciple: number
  contentOpacity: number
  roomIntensities: [number, number, number, number]
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

export function getApartmentFacadeState(rawProgress: number): ApartmentFacadeState {
  const progress = clamp(rawProgress)
  const phase: ApartmentFacadePhase = progress < .14 ? 'tree-arrival' : progress < .88 ? 'principles' : 'process-exit'
  const activePrinciple = Math.min(3, Math.max(0, Math.floor((progress - .14) / .18)))
  const enter = reveal(progress, .035, .13)
  const leave = 1 - reveal(progress, .9, 1)
  const roomIntensities = [0, 1, 2, 3].map((index) => index === activePrinciple ? 1 : .26) as [number, number, number, number]

  return {
    progress,
    phase,
    activePrinciple,
    contentOpacity: Math.min(enter, leave),
    roomIntensities,
    camera: {
      x: interpolate(progress, [
        { progress: 0, value: -3.8 },
        { progress: .18, value: -.8 },
        { progress: .52, value: .35 },
        { progress: .84, value: 1.2 },
        { progress: 1, value: 2.6 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 2.8 },
        { progress: .18, value: 3.5 },
        { progress: .7, value: 3.65 },
        { progress: 1, value: 3.9 },
      ]),
      z: interpolate(progress, [
        { progress: 0, value: 25.8 },
        { progress: .18, value: 23.8 },
        { progress: .72, value: 22.6 },
        { progress: 1, value: 21.4 },
      ]),
      targetX: interpolate(progress, [
        { progress: 0, value: -2.2 },
        { progress: .2, value: 0 },
        { progress: .7, value: .8 },
        { progress: 1, value: 2.1 },
      ]),
      targetY: interpolate(progress, [
        { progress: 0, value: 4.6 },
        { progress: .2, value: 4.25 },
        { progress: .7, value: 3.9 },
        { progress: 1, value: 3.5 },
      ]),
      targetZ: -7.2,
    },
    butterfly: {
      x: interpolate(progress, [
        { progress: 0, value: 92 },
        { progress: .18, value: 63 },
        { progress: .38, value: 55 },
        { progress: .56, value: 52 },
        { progress: .74, value: 59 },
        { progress: 1, value: 86 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 21 },
        { progress: .2, value: 48 },
        { progress: .38, value: 42 },
        { progress: .56, value: 52 },
        { progress: .74, value: 61 },
        { progress: 1, value: 78 },
      ]),
      scale: interpolate(progress, [
        { progress: 0, value: .18 },
        { progress: .2, value: .4 },
        { progress: .72, value: .33 },
        { progress: 1, value: .18 },
      ]),
      rotation: interpolate(progress, [
        { progress: 0, value: -15 },
        { progress: .25, value: 8 },
        { progress: .5, value: -5 },
        { progress: .75, value: 12 },
        { progress: 1, value: 18 },
      ]),
      opacity: Math.min(reveal(progress, 0, .06), 1 - reveal(progress, .9, 1)),
    },
  }
}
