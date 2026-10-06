import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { CoffeeShopState } from '../coffee-shop'
import type { SiteTheme } from '../SiteTheme'

type Props = { reducedMotion: boolean; theme: SiteTheme }

const ASSET_ROOT = '/assets/3d/coffee-shop'

export type CoffeeShopLightingProfile = {
  background: number
  fogColor: number
  fogDensity: number
  exposure: number
  ambientSky: number
  ambientGround: number
  ambientIntensity: number
  practicalIntensity: number
  accentIntensity: number
  wood: number
  brass: number
  floor: number
  wall: number
  darkWood: number
  glass: number
  doorGlow: number
  shadowMapType: THREE.ShadowMapType
}

export function getCoffeeShopLightingProfile(theme: SiteTheme = 'night'): CoffeeShopLightingProfile {
  const night: CoffeeShopLightingProfile = {
    background: 0x080503,
    fogColor: 0x080503,
    fogDensity: .014,
    exposure: 1.2,
    ambientSky: 0xb78963,
    ambientGround: 0x120805,
    ambientIntensity: 2.25,
    practicalIntensity: 54,
    accentIntensity: 18,
    wood: 0x35180d,
    brass: 0x8d6030,
    floor: 0x1a0e08,
    wall: 0x120a06,
    darkWood: 0x1b0c07,
    glass: 0x392116,
    doorGlow: 0xc56d30,
    shadowMapType: THREE.PCFShadowMap,
  }

  return theme === 'morning' ? {
    ...night,
    background: 0xe8dfd1,
    fogColor: 0xe8dfd1,
    fogDensity: .009,
    exposure: 1.12,
    ambientSky: 0xffe4c0,
    ambientGround: 0x71675a,
    ambientIntensity: 3.2,
    practicalIntensity: 15,
    accentIntensity: 4,
    wood: 0x805b3e,
    brass: 0xac8751,
    floor: 0x92795d,
    wall: 0xe2d3be,
    darkWood: 0x60442f,
    glass: 0xaaa896,
    doorGlow: 0xe4a45e,
  } : night
}

function normalizeModel(source: THREE.Object3D, targetHeight: number) {
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
    const originals = Array.isArray(child.material) ? child.material : [child.material]
    const materials = originals.map((material) => {
      const next = (material as THREE.MeshStandardMaterial).clone()
      next.roughness = Math.min(.72, Math.max(.25, next.roughness ?? .5))
      next.metalness = Math.min(.8, next.metalness ?? .1)
      return next
    })
    child.material = Array.isArray(child.material) ? materials : materials[0]
  })
  return wrapper
}

function cloneAt(model: THREE.Object3D, parent: THREE.Object3D, position: [number, number, number], rotationY = 0, scale = 1) {
  const clone = model.clone(true)
  clone.position.set(...position)
  clone.rotation.y = rotationY
  clone.scale.multiplyScalar(scale)
  parent.add(clone)
  return clone
}

function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

export function CoffeeShop3D({ reducedMotion, theme }: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const shell = shellRef.current
    const canvas = canvasRef.current
    if (!shell || !canvas || typeof WebGLRenderingContext === 'undefined') return

    const lighting = getCoffeeShopLightingProfile(theme)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(lighting.background)
    scene.fog = new THREE.FogExp2(lighting.fogColor, lighting.fogDensity)

    const camera = new THREE.PerspectiveCamera(38, 1, .1, 80)
    camera.position.set(2.2, 4.4, 16.5)
    camera.lookAt(1.2, 3.5, -3)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !matchMedia('(max-width: 700px)').matches, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = lighting.exposure
    renderer.shadowMap.enabled = !matchMedia('(max-width: 700px)').matches
    renderer.shadowMap.type = lighting.shadowMapType

    const room = new THREE.Group()
    scene.add(room)
    scene.add(new THREE.HemisphereLight(lighting.ambientSky, lighting.ambientGround, lighting.ambientIntensity))
    const key = new THREE.DirectionalLight(0xd6a36e, 2.6)
    key.position.set(-8, 11, 8)
    room.add(key)
    ;[
      [-5.5, 6.5, -1.5, lighting.practicalIntensity],
      [1.8, 7, -3.5, lighting.practicalIntensity],
      [8.8, 5.2, -6.8, lighting.practicalIntensity * .88],
    ].forEach(([x, y, z, intensity]) => {
      const light = new THREE.PointLight(0xffa85c, intensity, 15, 2.1)
      light.position.set(x, y, z)
      light.castShadow = renderer.shadowMap.enabled
      room.add(light)
    })
    const ember = new THREE.PointLight(0xd84125, lighting.accentIntensity, 9, 2)
    ember.position.set(7.3, 2.5, -2.2)
    room.add(ember)
    const loungeFill = new THREE.PointLight(0xf5a05b, 34, 14, 2.15)
    loungeFill.position.set(-7.8, 4.6, 4.2)
    room.add(loungeFill)
    const counterFill = new THREE.PointLight(0xe9b079, 28, 13, 2.1)
    counterFill.position.set(2, 4.4, 3.2)
    room.add(counterFill)

    const floorMaterial = new THREE.MeshPhysicalMaterial({ color: lighting.floor, roughness: .42, metalness: .08, clearcoat: .45, clearcoatRoughness: .25 })
    const wallMaterial = new THREE.MeshStandardMaterial({ color: lighting.wall, roughness: .88, metalness: .03 })
    const woodMaterial = new THREE.MeshStandardMaterial({ color: lighting.wood, roughness: .62, metalness: .05 })
    const darkWoodMaterial = new THREE.MeshStandardMaterial({ color: lighting.darkWood, roughness: .72 })
    const brassMaterial = new THREE.MeshStandardMaterial({ color: lighting.brass, roughness: .32, metalness: .78 })
    const glassMaterial = new THREE.MeshPhysicalMaterial({ color: lighting.glass, roughness: .12, metalness: .2, transmission: .12, transparent: true, opacity: .82 })
    const doorGlowMaterial = new THREE.MeshBasicMaterial({ color: lighting.doorGlow, transparent: true, opacity: theme === 'morning' ? .22 : .46 })
    const bagMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a35, roughness: .86, metalness: 0 })

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, -2)
    floor.receiveShadow = true
    room.add(floor)
    box(room, [30, 10, .5], [0, 5, -10], wallMaterial)
    box(room, [.5, 10, 26], [14, 5, 2], wallMaterial)
    box(room, [.5, 10, 26], [-14, 5, 2], wallMaterial)

    for (let index = 0; index < 9; index += 1) {
      box(room, [2.4, 2.6, .12], [-11.2 + index * 2.8, 2, -9.68], darkWoodMaterial)
      box(room, [.08, 2.45, .16], [-12.3 + index * 2.8, 2, -9.58], brassMaterial)
    }
    ;[2.9, 5.4, 7.75].forEach((height, row) => {
      box(room, [12.5, .16, .8], [1, height, -8.95], woodMaterial)
      for (let index = 0; index < 10; index += 1) {
        const jar = new THREE.Mesh(
          new THREE.CylinderGeometry(.12 + (index % 3) * .02, .14, .44 + (index % 2) * .14, 14),
          index % 4 === 0 ? brassMaterial : glassMaterial,
        )
        jar.position.set(-4.3 + index * 1.15, height + .28, -8.6 + (row % 2) * .04)
        room.add(jar)
      }
      if (row > 0) {
        for (let index = 0; index < 5; index += 1) {
          const bag = box(room, [.48, .78, .18], [-3.1 + index * 1.35, height + .45, -8.56], bagMaterial)
          bag.rotation.z = (index % 2 ? 1 : -1) * .025
        }
      }
    })

    box(room, [12.8, 2.25, 2.35], [2.1, 1.13, -3.65], darkWoodMaterial)
    box(room, [13.2, .18, 2.6], [2.1, 2.28, -3.65], woodMaterial)
    for (let index = 0; index < 7; index += 1) box(room, [.07, 1.65, .16], [-3.2 + index * 1.75, 1.15, -2.43], brassMaterial)

    box(room, [4.2, 5.8, .25], [9.3, 5.65, -9.55], darkWoodMaterial)
    box(room, [2.5, 3.9, .14], [10, 2.05, -9.38], doorGlowMaterial)
    box(room, [.16, 4.3, .32], [8.68, 2.2, -9.28], brassMaterial)
    box(room, [.16, 4.3, .32], [11.32, 2.2, -9.28], brassMaterial)
    box(room, [2.8, .16, .32], [10, 4.32, -9.28], brassMaterial)

    const loader = new GLTFLoader()
    let disposed = false
    let hasStartedLoading = false
    const loadModel = (path: string, targetHeight: number) => loader.loadAsync(`${ASSET_ROOT}/${path}`).then(({ scene: model }) => normalizeModel(model, targetHeight))
    const loadInterior = () => {
      if (hasStartedLoading) return
      hasStartedLoading = true
      Promise.all([
        loadModel('armchair/ArmChair_01_1k.gltf', 2.2),
        loadModel('chandelier/Chandelier_03_1k.gltf', 2.3),
        loadModel('coffee-table/modern_coffee_table_01_1k.gltf', 1.15),
        loadModel('coffee-cart/CoffeeCart_01_1k.gltf', 3.6),
      ]).then(([chair, chandelier, table, coffeeCart]) => {
        if (disposed) return
        cloneAt(chair, room, [-9, 0, .2], .48, 1.16)
        cloneAt(chair, room, [-5.7, 0, 3.4], 2.3, 1.02)
        cloneAt(chair, room, [8.8, 0, 2.2], -2.18, 1)
        cloneAt(table, room, [-7.35, 0, 1.8], .08, 1.14)
        cloneAt(table, room, [7.25, 0, 3.2], -.18, 1)
        cloneAt(coffeeCart, room, [2.1, 0, -3.35], Math.PI, 1.42)
        cloneAt(chandelier, room, [1.7, 6.4, -3.3], 0, 1.05)
        cloneAt(chandelier, room, [-5.4, 6.65, -1.6], .15, .72)
        shell.dataset.ready = 'true'
      }).catch(() => { shell.dataset.ready = 'fallback' })
    }

    let isVisible = shell.getBoundingClientRect().top < window.innerHeight && shell.getBoundingClientRect().bottom > 0
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (entry.isIntersecting) loadInterior()
    }, { rootMargin: '60%' })
    visibilityObserver.observe(shell)
    if (isVisible) loadInterior()

    const target = new THREE.Vector3(1.2, 3.5, -3)
    let targetState: CoffeeShopState['camera'] = { x: 2.2, y: 4.4, z: 16.5, targetX: 1.2, targetY: 3.5, targetZ: -3 }
    const renderedState = { ...targetState }
    const onProgress = (event: Event) => { targetState = (event as CustomEvent<CoffeeShopState>).detail.camera }
    window.addEventListener('webnest:coffee-progress', onProgress)

    const resize = () => {
      const width = Math.max(shell.clientWidth, 1)
      const height = Math.max(shell.clientHeight, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, matchMedia('(max-width: 700px)').matches ? 1 : 1.4))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(shell)
    resize()

    let frame = 0
    let lastRender = 0
    const draw = (now = 0) => {
      if (!isVisible || now - lastRender < 32) { frame = requestAnimationFrame(draw); return }
      lastRender = now
      const ease = reducedMotion ? 1 : .06
      ;(Object.keys(renderedState) as Array<keyof typeof renderedState>).forEach((keyName) => {
        renderedState[keyName] += (targetState[keyName] - renderedState[keyName]) * ease
      })
      camera.position.set(renderedState.x, renderedState.y, renderedState.z)
      target.set(renderedState.targetX, renderedState.targetY, renderedState.targetZ)
      camera.lookAt(target)
      renderer.render(scene, camera)
      frame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('webnest:coffee-progress', onProgress)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
    }
  }, [reducedMotion, theme])

  return <div ref={shellRef} className="coffee-shop-3d" data-ready="loading"><canvas ref={canvasRef} role="img" aria-label="Royal 3D coffee shop interior" /></div>
}
