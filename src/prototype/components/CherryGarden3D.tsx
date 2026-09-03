import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { CherryGardenState } from '../cherry-garden'

type Props = { reducedMotion: boolean; activeJourney: number }

type PetalSeed = {
  x: number
  y: number
  z: number
  speed: number
  drift: number
  phase: number
  spin: number
  scale: number
}

const LAMP_URL = '/assets/3d/city/kenney-roads/street-light.glb'
const SAKURA_TREE_URL = '/assets/3d/cherry-garden/webnest-sakura.glb'

export function getCherryGardenPerformanceProfile(compact: boolean) {
  return {
    treeAsset: SAKURA_TREE_URL,
    petalCount: compact ? 44 : 80,
    blossomCount: compact ? 280 : 420,
    maxPixelRatio: compact ? 1 : 1.1,
    shadows: false,
    frameInterval: compact ? 48 : 40,
  } as const
}

function createBlossomCloud(count: number) {
  const geometry = new THREE.IcosahedronGeometry(.13, 0)
  const material = new THREE.MeshStandardMaterial({ color: 0xf1a0b2, emissive: 0x5b1728, emissiveIntensity: .34, roughness: .72 })
  const blossoms = new THREE.InstancedMesh(geometry, material, count)
  blossoms.name = 'WebNest Sakura Instanced Blossoms'
  blossoms.frustumCulled = false
  const dummy = new THREE.Object3D()
  const colors = [new THREE.Color(0xf3a6b5), new THREE.Color(0xd98297), new THREE.Color(0xf0bcc5)]
  let seed = 187491
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 4294967295
  }
  for (let index = 0; index < count; index += 1) {
    const x = -8.2 + random() * 13.2
    const y = 3.4 + random() * 7.8
    const z = -4.8 + random() * 9.6
    const crown = 1 - Math.min(1, Math.hypot((x + 2.2) / 7.2, z / 5.5))
    dummy.position.set(x, y + crown * 1.7, z)
    dummy.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI)
    const scale = .5 + random() * 1.15
    dummy.scale.set(scale * 1.2, scale * .72, scale)
    dummy.updateMatrix()
    blossoms.setMatrixAt(index, dummy.matrix)
    blossoms.setColorAt(index, colors[index % colors.length])
  }
  blossoms.instanceMatrix.needsUpdate = true
  if (blossoms.instanceColor) blossoms.instanceColor.needsUpdate = true
  return blossoms
}

function normalizeTree(source: THREE.Object3D, targetHeight: number) {
  const wrapper = new THREE.Group()
  wrapper.add(source)
  const initial = new THREE.Box3().setFromObject(source)
  const size = initial.getSize(new THREE.Vector3())
  source.scale.setScalar(targetHeight / Math.max(size.y, .001))
  const bounds = new THREE.Box3().setFromObject(source)
  const center = bounds.getCenter(new THREE.Vector3())
  source.position.set(-center.x, -bounds.min.y, -center.z)
  source.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    child.castShadow = true
    child.receiveShadow = true
    const current = Array.isArray(child.material) ? child.material : [child.material]
    const materials = current.map((material) => {
      const next = (material as THREE.MeshStandardMaterial).clone()
      next.roughness = Math.max(.5, next.roughness ?? .7)
      next.metalness = 0
      next.side = THREE.DoubleSide
      return next
    })
    child.material = Array.isArray(child.material) ? materials : materials[0]
  })
  return wrapper
}

function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

function makePetalSeeds(count: number): PetalSeed[] {
  let seed = 2166136261
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 4294967295
  }
  return Array.from({ length: count }, () => ({
    x: -8 + random() * 17,
    y: 1.2 + random() * 9.5,
    z: -7 + random() * 9,
    speed: .00022 + random() * .00034,
    drift: .25 + random() * .8,
    phase: random() * Math.PI * 2,
    spin: .6 + random() * 2.2,
    scale: .6 + random() * .8,
  }))
}

export function CherryGarden3D({ reducedMotion, activeJourney }: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeJourneyRef = useRef(activeJourney)

  useEffect(() => { activeJourneyRef.current = activeJourney }, [activeJourney])

  useEffect(() => {
    const shell = shellRef.current
    const canvas = canvasRef.current
    if (!shell || !canvas || typeof WebGLRenderingContext === 'undefined') return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x030405)
    scene.fog = new THREE.FogExp2(0x050608, .028)

    const camera = new THREE.PerspectiveCamera(39, 1, .1, 90)
    camera.position.set(6.8, 2.25, 20.5)
    camera.lookAt(5.8, 1.6, -2.4)

    const compact = matchMedia('(max-width: 700px)').matches
    const performanceProfile = getCherryGardenPerformanceProfile(compact)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !compact, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.42
    renderer.shadowMap.enabled = performanceProfile.shadows
    renderer.shadowMap.type = THREE.PCFShadowMap

    const world = new THREE.Group()
    scene.add(world)
    scene.add(new THREE.HemisphereLight(0x7e91aa, 0x120b08, 2.2))
    const moon = new THREE.DirectionalLight(0x9eb7d2, 2.6)
    moon.position.set(-8, 14, 8)
    moon.castShadow = renderer.shadowMap.enabled
    world.add(moon)
    const windowGlow = new THREE.PointLight(0xff9c51, 58, 18, 2.1)
    windowGlow.position.set(2.2, 4.2, -5.7)
    world.add(windowGlow)
    const blossomFill = new THREE.PointLight(0xf28ba8, 66, 21, 2.05)
    blossomFill.position.set(4.4, 8.8, -.4)
    world.add(blossomFill)

    const asphalt = new THREE.MeshPhysicalMaterial({ color: 0x090b0e, roughness: .25, metalness: .26, clearcoat: .78, clearcoatRoughness: .16 })
    const stone = new THREE.MeshStandardMaterial({ color: 0x18191a, roughness: .82, metalness: .06 })
    const facade = new THREE.MeshStandardMaterial({ color: 0x211612, roughness: .9, metalness: .02 })
    const plaster = new THREE.MeshStandardMaterial({ color: 0x393029, roughness: .94 })
    const timber = new THREE.MeshStandardMaterial({ color: 0x351d14, roughness: .74 })
    const roofTile = new THREE.MeshStandardMaterial({ color: 0x111417, roughness: .58, metalness: .18 })
    const warmWindow = new THREE.MeshBasicMaterial({ color: 0xff9a50, transparent: true, opacity: .7 })
    const darkGlass = new THREE.MeshPhysicalMaterial({ color: 0x141820, roughness: .13, metalness: .3, transparent: true, opacity: .82 })

    const road = new THREE.Mesh(new THREE.PlaneGeometry(34, 28), asphalt)
    road.rotation.x = -Math.PI / 2
    road.position.set(0, 0, -3)
    road.receiveShadow = true
    world.add(road)
    const pavement = box(world, [32, .32, 5.2], [0, .1, -8.2], stone)
    pavement.receiveShadow = true

    const machiya = new THREE.Group()
    machiya.position.set(3.45, 0, 0)
    world.add(machiya)
    box(machiya, [18.5, 8.5, .95], [2.8, 4.25, -10.1], facade)
    box(machiya, [18.1, 2.7, .24], [2.8, 6.35, -9.54], plaster)
    box(machiya, [19.8, .38, 2.15], [2.7, 7.84, -9.65], roofTile)
    box(machiya, [20.8, .26, 1.85], [2.7, 4.43, -9.35], roofTile)
    box(machiya, [19.2, .22, 1.25], [2.7, 4.12, -9.13], timber)
    box(machiya, [.52, 8.4, 1.25], [-6.15, 4.2, -9.48], timber)
    box(machiya, [.52, 8.4, 1.25], [11.75, 4.2, -9.48], timber)
    for (let index = 0; index < 15; index += 1) {
      box(machiya, [.11, 3.25, .2], [-5.45 + index * 1.16, 2.18, -9.12], timber)
    }
    ;[.68, 1.76, 2.84, 4.76, 6.94, 8.02].forEach((height) => {
      box(machiya, [17.55, .1, .2], [2.75, height, -9.1], timber)
    })

    const distantStone = new THREE.MeshStandardMaterial({ color: 0x11161a, roughness: .95 })
    box(world, [7.2, 11.5, 3.8], [-9.5, 5.75, -15.2], distantStone)
    box(world, [5.5, 9.4, 3.2], [-14.8, 4.7, -19], distantStone)
    ;[[-11.2, 5.2], [-9.1, 7.9], [-14.4, 3.8]].forEach(([x, y]) => {
      box(world, [.75, 1.25, .08], [x, y, -12.95], warmWindow)
    })

    ;[
      [-2.8, 5.8, 2.3, 2.2], [1.2, 5.8, 2.4, 2.2], [5.5, 5.8, 2.4, 2.2],
      [-2.8, 2.5, 2.3, 2.25], [1.2, 2.5, 2.4, 2.25], [5.5, 2.5, 2.4, 2.25],
    ].forEach(([x, y, width, height], index) => {
      box(machiya, [width + .28, height + .28, .22], [x, y, -9.48], timber)
      box(machiya, [width, height, .12], [x, y, -9.33], index % 3 === 1 ? darkGlass : warmWindow)
      box(machiya, [.08, height, .16], [x, y, -9.2], timber)
      box(machiya, [width, .08, .16], [x, y, -9.2], timber)
    })
    box(machiya, [2.35, 3.65, .28], [9.35, 2, -9.37], timber)
    box(machiya, [1.72, 2.98, .12], [9.35, 1.91, -9.18], warmWindow)
    for (let index = 0; index < 4; index += 1) box(machiya, [.08, 2.96, .15], [8.72 + index * .42, 1.91, -9.08], timber)

    const lanternHousing = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, .48, 12), new THREE.MeshStandardMaterial({ color: 0x3d2619, roughness: .55, metalness: .35 }))
    lanternHousing.position.set(6.8, 3.28, -8.62)
    machiya.add(lanternHousing)
    const lanternCore = new THREE.Mesh(new THREE.CylinderGeometry(.12, .15, .36, 12), new THREE.MeshBasicMaterial({ color: 0xffaa5c }))
    lanternCore.position.copy(lanternHousing.position)
    machiya.add(lanternCore)
    const lanternLight = new THREE.PointLight(0xff9a55, 42, 10, 2.1)
    lanternLight.position.set(6.8, 3.25, -7.8)
    world.add(lanternLight)

    const puddleMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1d1820, roughness: .1, metalness: .45, clearcoat: 1, transparent: true, opacity: .68 })
    ;[[-5, 1.1, .7], [1.6, 3, 1], [7.2, .5, .62]].forEach(([x, z, scale]) => {
      const puddle = new THREE.Mesh(new THREE.CircleGeometry(2.3 * scale, 36), puddleMaterial)
      puddle.rotation.x = -Math.PI / 2
      puddle.scale.y = .38
      puddle.position.set(x, .018, z)
      world.add(puddle)
    })

    const markerPositions: Array<[number, number, number]> = [
      [3.7, 7.2, -3.3], [7.1, 6.5, -3.7], [.2, 5.25, -3.2], [-3.1, 3.1, -2.8], [2.7, 2.1, -3], [7.8, 3, -3.4],
    ]
    const markerMaterials = markerPositions.map(() => new THREE.MeshStandardMaterial({ color: 0x6f2f35, emissive: 0x421218, emissiveIntensity: .65, roughness: .45, metalness: .25 }))
    const markers = markerPositions.map((position, index) => {
      const marker = new THREE.Mesh(new THREE.IcosahedronGeometry(.085, 1), markerMaterials[index])
      marker.position.set(...position)
      world.add(marker)
      return marker
    })
    const journeyGlow = new THREE.PointLight(0xff7f91, 6, 4.5, 2.2)
    journeyGlow.position.set(...markerPositions[0])
    world.add(journeyGlow)

    const petalSeeds = makePetalSeeds(performanceProfile.petalCount)
    const petalGeometry = new THREE.CircleGeometry(.075, 5)
    petalGeometry.scale(1, .55, 1)
    const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xe99aaa, emissive: 0x4f1822, emissiveIntensity: .34, roughness: .72, side: THREE.DoubleSide, transparent: true, opacity: .9 })
    const petals = new THREE.InstancedMesh(petalGeometry, petalMaterial, petalSeeds.length)
    petals.frustumCulled = false
    world.add(petals)
    const petalDummy = new THREE.Object3D()

    const loader = new GLTFLoader()
    let disposed = false
    let treeLoading = false
    let sakuraTree: THREE.Group | null = null
    const loadTree = () => {
      if (treeLoading) return
      treeLoading = true
      loader.loadAsync(performanceProfile.treeAsset).then(({ scene: source }) => {
        if (disposed) return
        sakuraTree = source
        sakuraTree.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return
          child.castShadow = false
          child.receiveShadow = false
        })
        sakuraTree.add(createBlossomCloud(performanceProfile.blossomCount))
        sakuraTree.position.set(6.3, .25, -5.3)
        sakuraTree.rotation.y = -.34
        sakuraTree.rotation.z = .035
        sakuraTree.scale.setScalar(.72)
        world.add(sakuraTree)

        // Reuse the same generated geometry as a second, off-screen-rooted crown.
        // Its leaning trunk creates the long lateral bough and blossom ceiling
        // that define the supplied reference, without adding a photographic plate.
        const canopyArm = sakuraTree.clone(true)
        canopyArm.name = 'WebNest Sakura Lateral Canopy'
        canopyArm.position.set(10.2, 3.1, -5.55)
        canopyArm.rotation.set(.08, -.48, .94)
        canopyArm.scale.setScalar(.7)
        world.add(canopyArm)
        shell.dataset.ready = 'true'
      }).catch(() => { shell.dataset.ready = 'error' })

      loader.loadAsync(LAMP_URL).then(({ scene: source }) => {
        if (disposed) return
        const lamp = normalizeTree(source, 4.4)
        lamp.position.set(-5.5, .28, -6.1)
        lamp.rotation.y = .2
        world.add(lamp)
        const light = new THREE.PointLight(0xffa45f, 31, 11, 2.2)
        light.position.set(-5.5, 4, -5.7)
        world.add(light)

        ;[
          { position: [-9.1, .18, -10.3] as const, scale: .72, intensity: 18 },
          { position: [-12.1, .12, -14.1] as const, scale: .48, intensity: 10 },
        ].forEach(({ position, scale, intensity }) => {
          const distantLamp = lamp.clone(true)
          distantLamp.position.set(...position)
          distantLamp.scale.setScalar(scale)
          distantLamp.rotation.y = .2
          world.add(distantLamp)
          const distantGlow = new THREE.PointLight(0xffa45f, intensity, 9 * scale, 2.2)
          distantGlow.position.set(position[0], position[1] + 3.7 * scale, position[2] + .35)
          world.add(distantGlow)
        })
      }).catch(() => undefined)
    }

    let targetCamera: CherryGardenState['camera'] = { x: 6.8, y: 2.25, z: 20.5, targetX: 5.8, targetY: 1.6, targetZ: -2.4 }
    const renderedCamera = { ...targetCamera }
    let targetPetalIntensity = 0
    let renderedPetalIntensity = 0
    const onProgress = (event: Event) => {
      const state = (event as CustomEvent<CherryGardenState>).detail
      targetCamera = state.camera
      targetPetalIntensity = reducedMotion ? Math.min(.18, state.petalIntensity) : state.petalIntensity
    }
    window.addEventListener('webnest:cherry-progress', onProgress)

    let isVisible = shell.getBoundingClientRect().top < window.innerHeight && shell.getBoundingClientRect().bottom > 0
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (entry.isIntersecting) loadTree()
    }, { rootMargin: '70%' })
    visibilityObserver.observe(shell)
    if (isVisible) loadTree()

    const resize = () => {
      const width = Math.max(shell.clientWidth, 1)
      const height = Math.max(shell.clientHeight, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceProfile.maxPixelRatio))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(shell)
    resize()

    const target = new THREE.Vector3()
    let frame = 0
    let lastRender = 0
    const draw = (now = 0) => {
      if (!isVisible || now - lastRender < performanceProfile.frameInterval) { frame = requestAnimationFrame(draw); return }
      lastRender = now
      const ease = reducedMotion ? 1 : .065
      ;(Object.keys(renderedCamera) as Array<keyof typeof renderedCamera>).forEach((key) => {
        renderedCamera[key] += (targetCamera[key] - renderedCamera[key]) * ease
      })
      renderedPetalIntensity += (targetPetalIntensity - renderedPetalIntensity) * .08
      camera.position.set(renderedCamera.x, renderedCamera.y, renderedCamera.z)
      target.set(renderedCamera.targetX, renderedCamera.targetY, renderedCamera.targetZ)
      camera.lookAt(target)

      const active = activeJourneyRef.current
      markerMaterials.forEach((material, index) => {
        const selected = index === active
        material.color.setHex(selected ? 0xd56a77 : 0x6f2f35)
        material.emissive.setHex(selected ? 0xa12c3f : 0x421218)
        material.emissiveIntensity = selected ? 2.1 : .65
        const pulse = selected && !reducedMotion ? 1 + Math.sin(now * .004) * .18 : 1
        markers[index].scale.setScalar(pulse)
      })
      journeyGlow.position.copy(markers[active]?.position ?? markers[0].position)
      petalSeeds.forEach((seed, index) => {
        const fall = reducedMotion ? 0 : (now * seed.speed) % 1
        const y = seed.y - fall * 10.7
        petalDummy.position.set(seed.x + Math.sin(now * .00055 + seed.phase) * seed.drift, y < .1 ? y + 10.7 : y, seed.z + Math.cos(now * .00037 + seed.phase) * .4)
        petalDummy.rotation.set(now * .0004 * seed.spin + seed.phase, seed.phase, now * .00025 * seed.spin)
        const scale = seed.scale * renderedPetalIntensity
        petalDummy.scale.setScalar(scale)
        petalDummy.updateMatrix()
        petals.setMatrixAt(index, petalDummy.matrix)
      })
      petals.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      frame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('webnest:cherry-progress', onProgress)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
    }
  }, [reducedMotion])

  return (
    <div ref={shellRef} className="cherry-garden-3d" role="img" aria-label="Real-time 3D cherry blossom garden at night" data-ready="loading">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
