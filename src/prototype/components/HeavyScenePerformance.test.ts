import { describe, expect, it } from 'vitest'
import { getCherryGardenPerformanceProfile } from './CherryGarden3D'
import { getApartmentFacadePerformanceProfile } from './ApartmentFacade3D'

describe('heavy scene performance budgets', () => {
  it('uses the baked sakura mesh and a restrained live-particle budget', () => {
    const profile = getCherryGardenPerformanceProfile(false)
    expect(profile.treeAsset).toBe('/assets/3d/cherry-garden/webnest-sakura.glb')
    expect(profile.petalCount).toBeLessThanOrEqual(80)
    expect(profile.blossomCount).toBeGreaterThanOrEqual(300)
    expect(profile.blossomCount).toBeLessThanOrEqual(480)
    expect(profile.maxPixelRatio).toBeLessThanOrEqual(1.1)
    expect(profile.shadows).toBe(false)
    expect(profile.frameInterval).toBeGreaterThanOrEqual(40)
  })

  it('keeps the apartment draw surface and shadow cost within budget', () => {
    const profile = getApartmentFacadePerformanceProfile(false)
    expect(profile.maxPixelRatio).toBeLessThanOrEqual(1.1)
    expect(profile.shadows).toBe(false)
    expect(profile.frameInterval).toBeGreaterThanOrEqual(40)
  })
})
