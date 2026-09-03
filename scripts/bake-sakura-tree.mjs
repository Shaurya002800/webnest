import { writeFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

const dom = new JSDOM('<!doctype html>')
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Image: dom.window.Image,
  FileReader: dom.window.FileReader,
  Blob: dom.window.Blob,
})

const { BarkType, Billboard, LeafType, Tree } = await import('@dgreenheck/ez-tree')
const tree = new Tree()
tree.options.seed = 91731
tree.options.bark.type = BarkType.Oak
tree.options.bark.textured = false
tree.options.branch.levels = 3
tree.options.branch.angle = { 1: 58, 2: 52, 3: 38 }
tree.options.branch.children = { 0: 8, 1: 5, 2: 4 }
tree.options.branch.force = { direction: { x: -.72, y: 1, z: .12 }, strength: .062 }
tree.options.branch.gnarliness = { 0: .11, 1: .19, 2: .24, 3: .14 }
tree.options.branch.length = { 0: 10.8, 1: 10.4, 2: 5.7, 3: 2.2 }
tree.options.branch.radius = { 0: 1.08, 1: .52, 2: .26, 3: .08 }
tree.options.branch.sections = { 0: 12, 1: 8, 2: 6, 3: 4 }
tree.options.branch.segments = { 0: 10, 1: 7, 2: 5, 3: 4 }
tree.options.branch.start = { 1: .28, 2: .24, 3: .18 }
tree.options.branch.taper = { 0: .68, 1: .72, 2: .78, 3: .86 }
tree.options.branch.twist = { 0: .04, 1: -.12, 2: .16, 3: -.1 }
tree.options.leaves.type = LeafType.Aspen
tree.options.leaves.billboard = Billboard.Double
tree.options.leaves.angle = 42
tree.options.leaves.count = 14
tree.options.leaves.start = .18
tree.options.leaves.size = .76
tree.options.leaves.sizeVariance = .42
tree.generate()
tree.name = 'WebNest Sakura Canopy — baked from MIT-licensed EZ Tree geometry'
tree.branchesMesh.material = new THREE.MeshStandardMaterial({ color: 0x6f5145, roughness: .88 })
tree.leavesMesh.material = new THREE.MeshStandardMaterial({ color: 0xf2a0b2, emissive: 0x41121d, emissiveIntensity: .16, roughness: .72, side: THREE.DoubleSide })

const binary = await new GLTFExporter().parseAsync(tree, { binary: true, onlyVisible: true })
const output = new Uint8Array(binary)
await writeFile(new URL('../public/assets/3d/cherry-garden/webnest-sakura.glb', import.meta.url), output)
console.log(`Baked sakura tree: ${(output.byteLength / 1024).toFixed(1)} KiB`)
