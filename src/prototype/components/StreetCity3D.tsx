import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { StreetSystemState } from '../street-system'

type Props = { reducedMotion: boolean }

const CITY_ASSETS = '/assets/3d/city'

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

function applyCityMaterial(root: THREE.Object3D, baseColor: THREE.ColorRepresentation) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material]
    const materials = sourceMaterials.map((sourceMaterial) => {
      const source = sourceMaterial as THREE.MeshStandardMaterial
      const isWindow = /glass|window|interior/.test(source.name?.toLowerCase() ?? '')
      return new THREE.MeshStandardMaterial({
        color: source.map ? 0x67717c : isWindow ? 0x303b4a : baseColor,
        map: source.map ?? null,
        alphaMap: source.alphaMap ?? null,
        transparent: source.transparent,
        opacity: source.opacity,
        side: source.side,
        roughness: isWindow ? .28 : .7,
        metalness: isWindow ? .42 : .1,
        emissive: isWindow ? 0x2b1b12 : 0x000000,
        emissiveIntensity: isWindow ? .7 : 0,
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

export function StreetCity3D({ reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const shell = shellRef.current
    if (!canvas || !shell || typeof WebGLRenderingContext === 'undefined') return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x02040a)
    scene.fog = new THREE.FogExp2(0x02040a, .012)

    const camera = new THREE.PerspectiveCamera(39, 1, .1, 180)
    const cameraTarget = new THREE.Vector3(0, 3.8, -30)
    camera.position.set(0, 5.4, 15)
    camera.lookAt(cameraTarget)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !matchMedia('(max-width: 700px)').matches, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = .96
    renderer.shadowMap.enabled = false

    const city = new THREE.Group()
    scene.add(city)

    scene.add(new THREE.HemisphereLight(0x667994, 0x050607, 1.85))
    const moon = new THREE.DirectionalLight(0xa6bdd7, 3)
    moon.position.set(-14, 25, 10)
    scene.add(moon)

    const practicals = [
      [-7, 4.2, 0], [7, 4.2, -9], [-7, 4.2, -21], [7, 4.2, -34], [-7, 4.2, -47],
    ] as const
    practicals.forEach(([x, y, z], index) => {
      const light = new THREE.PointLight(index === 3 ? 0xad4b70 : 0xe1aa6e, index === 3 ? 22 : 30, 20, 2.1)
      light.position.set(x, y, z)
      city.add(light)
    })

    const streetWash = new THREE.DirectionalLight(0x536b88, 2.2)
    streetWash.position.set(18, 12, 12)
    city.add(streetWash)
    const skylineGlow = new THREE.PointLight(0x395878, 34, 76, 2.1)
    skylineGlow.position.set(0, 21, -52)
    city.add(skylineGlow)

    const wetRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(13.5, 115),
      new THREE.MeshPhysicalMaterial({ color: 0x080b10, roughness: .2, metalness: .16, clearcoat: 1, clearcoatRoughness: .12 }),
    )
    wetRoad.rotation.x = -Math.PI / 2
    wetRoad.position.set(0, -.05, -40)
    city.add(wetRoad)

    const pavementMaterial = new THREE.MeshStandardMaterial({ color: 0x11151a, roughness: .88, metalness: .03 })
    ;[-8.25, 8.25].forEach((x) => {
      const pavement = new THREE.Mesh(new THREE.BoxGeometry(3, .22, 115), pavementMaterial)
      pavement.position.set(x, .02, -40)
      city.add(pavement)
    })

    const laneMaterial = new THREE.MeshBasicMaterial({ color: 0x8a765c, transparent: true, opacity: .28 })
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
        applyCityMaterial(model, color)
        return normalizedModel(model, height)
      })
    const loadGlb = (name: string, height: number, color: THREE.ColorRepresentation) =>
      gltf.loadAsync(`${CITY_ASSETS}/${name}`).then(({ scene: model }) => {
        applyCityMaterial(model, color)
        return normalizedModel(model, height)
      })

    let disposed = false
    let hasStartedLoading = false
    const loadCity = () => {
      if (hasStartedLoading) return
      hasStartedLoading = true
      Promise.all([
        loadFbx('building-large.fbx', 18, 0x111721),
        loadFbx('building-medium.fbx', 14, 0x161a21),
        loadFbx('building-small.fbx', 10, 0x14181d),
        loadGlb('kenney-commercial/skyscraper-a.glb', 34, 0x10151e),
        loadGlb('kenney-commercial/skyscraper-c.glb', 42, 0x0d121a),
        loadGlb('kenney-roads/street-light.glb', 4.2, 0x262a2e),
        loadGlb('kenney-roads/street-light-double.glb', 4.4, 0x25292d),
        loadGlb('kenney-roads/traffic-light.glb', 4.5, 0x202427),
        loadGlb('kenney-roads/street-sign.glb', 3.3, 0x24282b),
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
  }, [reducedMotion])

  return (
    <div ref={shellRef} className="street-city-3d" data-ready="loading">
      <canvas ref={canvasRef} role="img" aria-label="Interactive 3D New York-inspired street" />
    </div>
  )
}
