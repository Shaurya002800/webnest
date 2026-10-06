import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { StreetSystemState } from '../street-system'
import type { SiteTheme } from '../SiteTheme'

type Props = { reducedMotion: boolean; theme: SiteTheme }

const CITY_ASSETS = '/assets/3d/city'

type StreetLightingProfile = {
  background: number
  fogColor: number
  fogDensity: number
  exposure: number
  ambientSky: number
  ambientGround: number
  ambientIntensity: number
  moonIntensity: number
  washIntensity: number
  skylineIntensity: number
  practicalIntensity: number
  accentIntensity: number
  mappedMaterial: number
  windowMaterial: number
  windowEmissive: number
  windowEmissiveIntensity: number
  buildingTint?: number
  roadColor: number
  roadRoughness: number
}

export function getStreetLightingProfile(theme: SiteTheme = 'night'): StreetLightingProfile {
  const night: StreetLightingProfile = {
    background: 0x050a14,
    fogColor: 0x050a14,
    fogDensity: .009,
    exposure: 1.12,
    ambientSky: 0x8198b5,
    ambientGround: 0x080b0f,
    ambientIntensity: 2.35,
    moonIntensity: 4.15,
    washIntensity: 3.1,
    skylineIntensity: 50,
    practicalIntensity: 44,
    accentIntensity: 30,
    mappedMaterial: 0x8e9dab,
    windowMaterial: 0x45566b,
    windowEmissive: 0x5d2b18,
    windowEmissiveIntensity: 1.05,
    roadColor: 0x0d151f,
    roadRoughness: .14,
  }

  return theme === 'morning' ? {
    ...night,
    background: 0xb8ced9,
    fogColor: 0xc3d5db,
    fogDensity: .005,
    exposure: 1.08,
    ambientSky: 0xffedda,
    ambientGround: 0x666b6b,
    ambientIntensity: 2.8,
    moonIntensity: 2.7,
    washIntensity: 2.4,
    skylineIntensity: 3,
    practicalIntensity: 7,
    accentIntensity: 3,
    mappedMaterial: 0xd3c7b4,
    windowMaterial: 0xa4b8bd,
    windowEmissive: 0x000000,
    windowEmissiveIntensity: 0,
    buildingTint: 0xc5b7a2,
    roadColor: 0x737b7d,
    roadRoughness: .48,
  } : night
}

function normalizedModel(source: THREE.Object3D, targetHeight: number) {
  const wrapper = new THREE.Group()
  wrapper.add(source)

  const initialBounds = new THREE.Box3().setFromObject(source)
  const initialSize = initialBounds.getSize(new THREE.Vector3())
  const scale = targetHeight / Math.max(initialSize.y, .001)
  source.scale.setScalar(scale)

  const bounds = new THREE.Box3().setFromObject(source)
  const center = bounds.getCenter(new THREE.Vector3())
  source.position.set(-center.x, -bounds.min.y, -center.z)
  return wrapper
}

function applyCityMaterial(root: THREE.Object3D, baseColor: THREE.ColorRepresentation, lighting: StreetLightingProfile) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material]
    const materials = sourceMaterials.map((sourceMaterial) => {
      const source = sourceMaterial as THREE.MeshStandardMaterial
      const isWindow = /glass|window|interior/.test(source.name?.toLowerCase() ?? '')
      return new THREE.MeshStandardMaterial({
        color: source.map ? lighting.mappedMaterial : isWindow ? lighting.windowMaterial : lighting.buildingTint ?? baseColor,
        map: source.map ?? null,
        alphaMap: source.alphaMap ?? null,
        transparent: source.transparent,
        opacity: source.opacity,
        side: source.side,
        roughness: isWindow ? .28 : .7,
        metalness: isWindow ? .42 : .1,
        emissive: isWindow ? lighting.windowEmissive : 0x000000,
        emissiveIntensity: isWindow ? lighting.windowEmissiveIntensity : 0,
      })
    })

    child.material = Array.isArray(child.material) ? materials : materials[0]
    child.castShadow = false
    child.receiveShadow = true
  })
}

function cloneAt(
  template: THREE.Object3D,
  parent: THREE.Object3D,
  position: [number, number, number],
  rotationY = 0,
  scale = 1,
) {
  const clone = template.clone(true)
  clone.position.set(...position)
  clone.rotation.y = rotationY
  clone.scale.multiplyScalar(scale)
  parent.add(clone)
  return clone
}

export function StreetCity3D({ reducedMotion, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const shell = shellRef.current
    if (!canvas || !shell || typeof WebGLRenderingContext === 'undefined') return
    const lighting = getStreetLightingProfile(theme)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(lighting.background)
    scene.fog = new THREE.FogExp2(lighting.fogColor, lighting.fogDensity)

    const camera = new THREE.PerspectiveCamera(39, 1, .1, 180)
    const cameraTarget = new THREE.Vector3(0, 3.8, -30)
    camera.position.set(0, 5.4, 15)
    camera.lookAt(cameraTarget)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !matchMedia('(max-width: 700px)').matches, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = lighting.exposure
    renderer.shadowMap.enabled = false

    const city = new THREE.Group()
    scene.add(city)

    scene.add(new THREE.HemisphereLight(lighting.ambientSky, lighting.ambientGround, lighting.ambientIntensity))
    const moon = new THREE.DirectionalLight(0xb2c9e4, lighting.moonIntensity)
    moon.position.set(-14, 25, 10)
    scene.add(moon)

    const practicals = [
      [-7, 4.2, 0], [7, 4.2, -9], [-7, 4.2, -21], [7, 4.2, -34], [-7, 4.2, -47],
    ] as const
    practicals.forEach(([x, y, z], index) => {
      const light = new THREE.PointLight(
        index === 3 ? 0xc44d82 : 0xf0b878,
        index === 3 ? lighting.accentIntensity : lighting.practicalIntensity,
        23,
        2.05,
      )
      light.position.set(x, y, z)
      city.add(light)
    })

    const streetWash = new THREE.DirectionalLight(0x6484a8, lighting.washIntensity)
    streetWash.position.set(18, 12, 12)
    city.add(streetWash)
    const skylineGlow = new THREE.PointLight(0x47789f, lighting.skylineIntensity, 82, 2.05)
    skylineGlow.position.set(0, 21, -52)
    city.add(skylineGlow)

    const wetRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(13.5, 115),
      new THREE.MeshPhysicalMaterial({ color: lighting.roadColor, roughness: lighting.roadRoughness, metalness: .2, clearcoat: 1, clearcoatRoughness: .08 }),
    )
    wetRoad.rotation.x = -Math.PI / 2
    wetRoad.position.set(0, -.05, -40)
    city.add(wetRoad)

    const pavementMaterial = new THREE.MeshStandardMaterial({ color: 0x19212a, roughness: .82, metalness: .04 })
    ;[-8.25, 8.25].forEach((x) => {
      const pavement = new THREE.Mesh(new THREE.BoxGeometry(3, .22, 115), pavementMaterial)
      pavement.position.set(x, .02, -40)
      city.add(pavement)
    })

    const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xb29a73, transparent: true, opacity: .36 })
    ;[-2.1, 2.1].forEach((x) => {
      const lane = new THREE.Mesh(new THREE.PlaneGeometry(.08, 106), laneMaterial)
      lane.rotation.x = -Math.PI / 2
      lane.position.set(x, .012, -40)
      city.add(lane)
    })

    const fbx = new FBXLoader()
    const gltf = new GLTFLoader()
    const loadFbx = (name: string, height: number, color: THREE.ColorRepresentation) =>
      fbx.loadAsync(`${CITY_ASSETS}/${name}`).then((model) => {
        applyCityMaterial(model, color, lighting)
        return normalizedModel(model, height)
      })
    const loadGlb = (name: string, height: number, color: THREE.ColorRepresentation) =>
      gltf.loadAsync(`${CITY_ASSETS}/${name}`).then(({ scene: model }) => {
        applyCityMaterial(model, color, lighting)
        return normalizedModel(model, height)
      })

    let disposed = false
    let hasStartedLoading = false
    const loadCity = () => {
      if (hasStartedLoading) return
      hasStartedLoading = true
      Promise.all([
        loadFbx('building-large.fbx', 18, 0x1b2735),
        loadFbx('building-medium.fbx', 14, 0x222a35),
        loadFbx('building-small.fbx', 10, 0x1b232c),
        loadGlb('kenney-commercial/skyscraper-a.glb', 34, 0x172333),
        loadGlb('kenney-commercial/skyscraper-c.glb', 42, 0x131d2a),
        loadGlb('kenney-roads/street-light.glb', 4.2, 0x343b43),
        loadGlb('kenney-roads/street-light-double.glb', 4.4, 0x323941),
        loadGlb('kenney-roads/traffic-light.glb', 4.5, 0x2d353c),
        loadGlb('kenney-roads/street-sign.glb', 3.3, 0x30383f),
      ]).then(([large, medium, small, towerA, towerC, lamp, doubleLamp, trafficLight, streetSign]) => {
        if (disposed) return
        const buildings = [large, medium, small]
        for (let index = 0; index < 8; index += 1) {
          const depth = 7 - index * 10.5
          const template = buildings[index % buildings.length]
          cloneAt(template, city, [-10.2 - (index % 2) * .8, 0, depth], Math.PI / 2, .9 + (index % 3) * .08)
          cloneAt(buildings[(index + 1) % buildings.length], city, [10.4 + ((index + 1) % 2) * .7, 0, depth - 4.6], -Math.PI / 2, .92 + ((index + 1) % 3) * .07)
        }

        cloneAt(towerA, city, [-10, 0, -57], .18)
        cloneAt(towerC, city, [9, 0, -63], -.12)
        cloneAt(towerA, city, [2.5, 0, -77], .08, .8)
        cloneAt(towerC, city, [-6, 0, -84], -.06, .7)

        for (let index = 0; index < 7; index += 1) {
          const z = 6 - index * 11
          cloneAt(index % 3 === 0 ? doubleLamp : lamp, city, [-6.9, .2, z], Math.PI / 2)
          cloneAt(lamp, city, [6.9, .2, z - 5.2], -Math.PI / 2)
        }
        cloneAt(trafficLight, city, [6.7, .15, -15], -Math.PI / 2)
        cloneAt(trafficLight, city, [-6.7, .15, -39], Math.PI / 2)
        cloneAt(streetSign, city, [-6.6, .12, -14.2], Math.PI / 2)
        shell.dataset.ready = 'true'
      }).catch(() => {
        shell.dataset.ready = 'fallback'
      })
    }

    let isVisible = shell.getBoundingClientRect().top < window.innerHeight && shell.getBoundingClientRect().bottom > 0
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (entry.isIntersecting) loadCity()
    }, { rootMargin: '70%' })
    visibilityObserver.observe(shell)
    if (isVisible) loadCity()

    let targetProgress = reducedMotion ? .48 : 0
    let renderedProgress = targetProgress
    const onProgress = (event: Event) => {
      const state = (event as CustomEvent<StreetSystemState>).detail
      targetProgress = reducedMotion ? .48 : state.routeProgress
    }
    window.addEventListener('webnest:street-progress', onProgress)

    const resize = () => {
      const width = Math.max(shell.clientWidth, 1)
      const height = Math.max(shell.clientHeight, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, matchMedia('(max-width: 700px)').matches ? 1 : 1.5))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(shell)
    resize()

    let frame = 0
    let lastRender = 0
    const draw = (now = 0) => {
      if (!isVisible || now - lastRender < 32) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastRender = now
      renderedProgress += (targetProgress - renderedProgress) * (reducedMotion ? 1 : .055)
      const forward = renderedProgress * 14
      camera.position.set(
        Math.sin(renderedProgress * Math.PI) * 1.1,
        5.4 - renderedProgress * .55,
        15 - forward,
      )
      cameraTarget.set(Math.sin(renderedProgress * Math.PI * .8) * .7, 3.8, -30 - forward * .55)
      camera.lookAt(cameraTarget)
      renderer.render(scene, camera)
      frame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('webnest:street-progress', onProgress)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
    }
  }, [reducedMotion, theme])

  return (
    <div ref={shellRef} className="street-city-3d" data-ready="loading">
      <canvas ref={canvasRef} role="img" aria-label="Interactive 3D New York-inspired street" />
    </div>
  )
}
