export type MotionPolicyInput = { reducedMotion: boolean; width: number; lowPower: boolean }

export function getMotionPolicy({ reducedMotion, width, lowPower }: MotionPolicyInput) {
  const tier = reducedMotion ? 'still' : lowPower || width < 680 ? 'minimal' : width < 1100 ? 'lite' : 'full'
  return {
    tier,
    smoothScroll: tier === 'full',
    continuousFlight: tier === 'full' || tier === 'lite',
    parallax: tier === 'full',
    ambientLayers: tier === 'full' ? 3 : tier === 'lite' ? 2 : 1,
  } as const
}

