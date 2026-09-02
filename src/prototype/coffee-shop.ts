export type CoffeeShopPhase = 'threshold' | 'service' | 'rear-door'

export type CoffeeShopState = {
  progress: number
  phase: CoffeeShopPhase
  activePillar: number
  contentOpacity: number
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

export function getCoffeeShopState(rawProgress: number): CoffeeShopState {
  const progress = clamp(rawProgress)
  const phase: CoffeeShopPhase = progress < .16 ? 'threshold' : progress < .86 ? 'service' : 'rear-door'
  const entryOpacity = reveal(progress, 0, .1)
  const exitOpacity = 1 - reveal(progress, .88, 1)

  return {
    progress,
    phase,
    activePillar: Math.min(3, Math.max(0, Math.floor((progress - .08) / .2))),
    contentOpacity: Math.min(entryOpacity, exitOpacity),
    camera: {
      x: interpolate(progress, [
        { progress: 0, value: 2.2 },
        { progress: .45, value: .35 },
        { progress: .78, value: -.4 },
        { progress: 1, value: 2.8 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 4.4 },
        { progress: .5, value: 3.6 },
        { progress: 1, value: 3.9 },
      ]),
      z: interpolate(progress, [
        { progress: 0, value: 16.5 },
        { progress: .5, value: 13.4 },
        { progress: 1, value: 10.2 },
      ]),
      targetX: interpolate(progress, [
        { progress: 0, value: 1.2 },
        { progress: .6, value: 0 },
        { progress: 1, value: 5.5 },
      ]),
      targetY: interpolate(progress, [
        { progress: 0, value: 3.5 },
        { progress: 1, value: 3.2 },
      ]),
      targetZ: interpolate(progress, [
        { progress: 0, value: -3 },
        { progress: .72, value: -4.6 },
        { progress: 1, value: -8 },
      ]),
    },
    butterfly: {
      x: interpolate(progress, [
        { progress: 0, value: 81 },
        { progress: .18, value: 74 },
        { progress: .5, value: 79 },
        { progress: .78, value: 83 },
        { progress: 1, value: 94 },
      ]),
      y: interpolate(progress, [
        { progress: 0, value: 31 },
        { progress: .18, value: 42 },
        { progress: .5, value: 49 },
        { progress: .78, value: 43 },
        { progress: 1, value: 23 },
      ]),
      scale: interpolate(progress, [
        { progress: 0, value: .24 },
        { progress: .22, value: .38 },
        { progress: .5, value: .48 },
        { progress: .8, value: .36 },
        { progress: 1, value: .2 },
      ]),
      rotation: interpolate(progress, [
        { progress: 0, value: 12 },
        { progress: .25, value: -7 },
        { progress: .5, value: 5 },
        { progress: .78, value: -9 },
        { progress: 1, value: -18 },
      ]),
      opacity: Math.min(reveal(progress, 0, .08), 1 - reveal(progress, .9, 1)),
    },
  }
}
