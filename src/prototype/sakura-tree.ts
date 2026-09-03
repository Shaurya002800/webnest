import { BarkType, Billboard, LeafType, Tree } from '@dgreenheck/ez-tree'

export function createSakuraTree() {
  const tree = new Tree()
  tree.options.seed = 91731
  tree.options.bark.type = BarkType.Oak
  tree.options.bark.tint = 0x6f5145
  tree.options.bark.textured = true
  tree.options.bark.textureScale = { x: .72, y: 3.8 }

  tree.options.branch.levels = 3
  tree.options.branch.angle = { 1: 58, 2: 52, 3: 38 }
  tree.options.branch.children = { 0: 8, 1: 5, 2: 4 }
  tree.options.branch.force = { direction: { x: -.72, y: 1, z: .12 }, strength: .062 }
  tree.options.branch.gnarliness = { 0: .11, 1: .19, 2: .24, 3: .14 }
  tree.options.branch.length = { 0: 10.8, 1: 10.4, 2: 5.7, 3: 2.2 }
  tree.options.branch.radius = { 0: 1.08, 1: .52, 2: .26, 3: .08 }
  tree.options.branch.sections = { 0: 14, 1: 10, 2: 8, 3: 5 }
  tree.options.branch.segments = { 0: 12, 1: 8, 2: 6, 3: 4 }
  tree.options.branch.start = { 1: .28, 2: .24, 3: .18 }
  tree.options.branch.taper = { 0: .68, 1: .72, 2: .78, 3: .86 }
  tree.options.branch.twist = { 0: .04, 1: -.12, 2: .16, 3: -.1 }

  tree.options.leaves.type = LeafType.Aspen
  tree.options.leaves.billboard = Billboard.Double
  tree.options.leaves.angle = 42
  tree.options.leaves.count = 28
  tree.options.leaves.start = .12
  tree.options.leaves.size = .68
  tree.options.leaves.sizeVariance = .46
  tree.options.leaves.tint = 0xf2a0b2
  tree.options.leaves.alphaTest = .34
  tree.generate()
  tree.name = 'WebNest Sakura Canopy'
  return tree
}
