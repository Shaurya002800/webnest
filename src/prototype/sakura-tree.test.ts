import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { createSakuraTree } from './sakura-tree'

describe('sakura tree geometry', () => {
  it('ships the generated tree as a compact baked mesh for runtime use', () => {
    const asset = resolve(process.cwd(), 'public/assets/3d/cherry-garden/webnest-sakura.glb')
    expect(existsSync(asset)).toBe(true)
    expect(statSync(asset).size).toBeLessThan(2_500_000)
  })

  it('generates a deep natural canopy instead of a flat scanned slab', () => {
    const tree = createSakuraTree()
    const size = new THREE.Box3().setFromObject(tree).getSize(new THREE.Vector3())
    expect(size.x).toBeGreaterThan(12)
    expect(size.y).toBeGreaterThan(9)
    expect(size.z).toBeGreaterThan(9)
    expect(size.z / size.x).toBeGreaterThan(.55)
  })

  it('produces dense branch and blossom geometry for the reference silhouette', () => {
    const tree = createSakuraTree()
    const branches = tree.branchesMesh.geometry.getAttribute('position').count
    const blossoms = tree.leavesMesh.geometry.getAttribute('position').count
    expect(branches).toBeGreaterThan(2_000)
    expect(blossoms).toBeGreaterThan(8_000)
    expect((tree.leavesMesh.material as THREE.MeshPhongMaterial).color.getHex()).toBe(0xf2a0b2)
  })
})
