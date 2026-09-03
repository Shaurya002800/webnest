import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { ApartmentFacadeState } from '../apartment-facade'

type Props = { reducedMotion: boolean; activePrinciple: number }

type WindowRoom = {
  frame: THREE.Group
  glow: THREE.MeshStandardMaterial
  light: THREE.PointLight
  blinds: THREE.Group
}

const PROP_ROOT = '/assets/3d/apartment/kenney-furniture'

export function getApartmentFacadePerformanceProfile(compact: boolean) {
  return {
    maxPixelRatio: compact ? 1 : 1.1,
    shadows: false,
    frameInterval: compact ? 48 : 40,
  } as const
}

function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

function normalizeProp(source: THREE.Object3D, targetHeight: number) {
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
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    const adjusted = materials.map((material) => {
      const next = material.clone() as THREE.MeshStandardMaterial
      next.roughness = Math.max(.48, next.roughness ?? .7)
      next.metalness = Math.min(.18, next.metalness ?? 0)
      next.emissive = new THREE.Color(next.color).multiplyScalar(.14)
      next.emissiveIntensity = .55
      return next
    })
    child.material = Array.isArray(child.material) ? adjusted : adjusted[0]
  })
  return wrapper
}

export function ApartmentFacade3D({ reducedMotion, activePrinciple }: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activePrincipleRef = useRef(activePrinciple)

  useEffect(() => { activePrincipleRef.current = activePrinciple }, [activePrinciple])

  useEffect(() => {
    const shell = shellRef.current
    const canvas = canvasRef.current
    if (!shell || !canvas || typeof WebGLRenderingContext === 'undefined') return

    const compact = matchMedia('(max-width: 700px)').matches
    const performanceProfile = getApartmentFacadePerformanceProfile(compact)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x030507)
    scene.fog = new THREE.FogExp2(0x04070a, .018)

    const camera = new THREE.PerspectiveCamera(34, 1, .1, 110)
    camera.position.set(-3.8, 2.8, 22.4)
    camera.lookAt(-2.2, 4.6, -7.2)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !compact, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = performanceProfile.shadows
    renderer.shadowMap.type = THREE.PCFShadowMap

    const world = new THREE.Group()
    scene.add(world)
    scene.add(new THREE.HemisphereLight(0x7890a1, 0x18110e, 2.35))
    const moon = new THREE.DirectionalLight(0x7890a8, 2.1)
    moon.position.set(-11, 15, 13)
    moon.castShadow = renderer.shadowMap.enabled
    world.add(moon)

    const concrete = new THREE.MeshStandardMaterial({ color: 0x24282b, roughness: .97, metalness: .02 })
    const concreteEdge = new THREE.MeshStandardMaterial({ color: 0x303335, roughness: .92, metalness: .05 })
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x121416, roughness: .64, metalness: .38 })
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, roughness: .4, metalness: .7 })
    const blindMaterial = new THREE.MeshStandardMaterial({ color: 0x171515, roughness: .82, metalness: .02, transparent: true, opacity: .62 })

    box(world, [24.6, 16.8, 1.1], [0, 3.05, -9.05], concrete)
    box(world, [25.2, .46, 1.65], [0, 11.55, -8.95], concreteEdge)
    box(world, [.5, 16.8, 1.65], [-12.45, 3.05, -8.95], concreteEdge)
    box(world, [.5, 16.8, 1.65], [12.45, 3.05, -8.95], concreteEdge)
    for (let y = -4.2; y <= 10.4; y += 2.1) box(world, [24.8, .16, 1.35], [0, y, -8.62], concreteEdge)
    for (let x = -10.6; x <= 10.6; x += 2.65) box(world, [.12, 16.4, 1.28], [x, 3.1, -8.61], concreteEdge)

    // Shallow architectural courses catch the cool city light and keep the façade legible.
    for (let y = -3.15; y <= 9.5; y += 2.1) box(world, [24.5, .055, .2], [0, y, -7.92], concreteEdge)
    const entryWash = new THREE.SpotLight(0xdfe7ed, 9, 28, Math.PI / 4.8, .72, 1.4)
    entryWash.position.set(-8.5, 12.5, 8)
    entryWash.target.position.set(-2, 2.5, -8)
    world.add(entryWash, entryWash.target)

    const featuredSpecs = [
      { x: -4.25, y: 2.65, w: 4.7, h: 2.25, color: 0xff9a3c },
      { x: 3.75, y: 2.65, w: 5.1, h: 2.25, color: 0xa4b949 },
      { x: -3.45, y: -.18, w: 5.35, h: 2.35, color: 0x35b7a8 },
      { x: 3.65, y: -.18, w: 5.05, h: 2.35, color: 0xff9c38 },
    ] as const

    const featuredRooms: WindowRoom[] = []
    const createRoom = (x: number, y: number, width: number, height: number, color: number, featured = false) => {
      const room = new THREE.Group()
      room.position.set(x, y, -7.98)
      world.add(room)
      const prominent = featured || width > 4
      const glow = new THREE.MeshStandardMaterial({
        color: prominent ? 0x171411 : 0x121212,
        emissive: color,
        emissiveIntensity: featured ? .26 : prominent ? .18 : .1,
        roughness: .88,
        transparent: prominent,
        opacity: prominent ? .54 : 1,
        depthWrite: !prominent,
      })
      box(room, [width, height, .12], [0, 0, 0], glow)
      box(room, [width + .22, .14, .38], [0, height / 2 + .06, .08], frameMaterial)
      box(room, [width + .22, .14, .38], [0, -height / 2 - .06, .08], frameMaterial)
      box(room, [.14, height, .38], [-width / 2 - .06, 0, .08], frameMaterial)
      box(room, [.14, height, .38], [width / 2 + .06, 0, .08], frameMaterial)
      box(room, [.08, height, .28], [0, 0, .16], frameMaterial)
      const blinds = new THREE.Group()
      blinds.position.z = .24
      const slatCount = prominent ? 5 : 4
      for (let index = 0; index < slatCount; index += 1) {
        const slatY = -height / 2 + (height / (slatCount + 1)) * (index + 1)
        box(blinds, [width - .22, .022, .042], [0, slatY, 0], blindMaterial)
      }
      blinds.visible = prominent || (Math.round((x + 20) * 10 + (y + 20) * 7) % 4 === 0)
      room.add(blinds)
      const light = new THREE.PointLight(color, featured ? 11 : 2.6, featured ? 6.2 : 3.2, 2.25)
      light.position.set(0, 0, 2.6)
      room.add(light)
      if (!featured && Math.abs(x + y) % 3 < 1) {
        const balcony = new THREE.Group()
        balcony.position.set(0, -height / 2 - .15, .62)
        box(balcony, [width + .45, .08, .75], [0, 0, 0], concreteEdge)
        box(balcony, [width + .3, .035, .035], [0, .54, .31], railMaterial)
        for (let rail = -width / 2; rail <= width / 2; rail += .34) box(balcony, [.025, 1.05, .025], [rail, .04, .31], railMaterial)
        room.add(balcony)
      }
      return { frame: room, glow, light, blinds }
    }

    featuredSpecs.forEach((spec) => featuredRooms.push(createRoom(spec.x, spec.y, spec.w, spec.h, spec.color, true)))
    createRoom(0, 6.22, 8.1, 2.45, 0xff9c3d, false)
    createRoom(-2.4, -3.05, 9.25, 1.58, 0xffa247, false)
    createRoom(5.7, -3.25, 4.25, 1.48, 0xff9a3d, false)

    const genericColors = [0xff9b3f, 0xf07138, 0x2aa99e, 0xffad55, 0x7e9a3a]
    const columns = [-10.55, -7.9, -5.25, -2.6, 0, 2.65, 5.3, 7.95, 10.6]
    const rows = [9.55, 7.45, 5.35, 3.2, 1.05, -1.1, -3.25]
    rows.forEach((y, rowIndex) => columns.forEach((x, columnIndex) => {
      const blocked = featuredSpecs.some((spec) => Math.abs(x - spec.x) < spec.w / 2 + .9 && Math.abs(y - spec.y) < spec.h / 2 + .7)
        || (Math.abs(x) < 4.7 && Math.abs(y - 6.22) < 1.7)
        || (Math.abs(x + 2.4) < 5.1 && Math.abs(y + 3.05) < 1.2)
        || (Math.abs(x - 5.7) < 2.6 && Math.abs(y + 3.25) < 1.1)
      if (blocked) return
      const lit = (rowIndex * 7 + columnIndex * 3) % 3 !== 0
      createRoom(x, y, 1.72, 1.38, lit ? genericColors[(rowIndex + columnIndex) % genericColors.length] : 0x17202a, false)
    }))

    const sideBuilding = new THREE.MeshStandardMaterial({ color: 0x0a0e12, roughness: .96 })
    box(world, [7.5, 13, 4], [-16.8, .7, -16], sideBuilding)
    box(world, [8.2, 15.5, 4.6], [17.1, 1.9, -17.8], sideBuilding)
    ;[[-16.4, 4.2], [-15.3, -.8], [16.1, 6.8], [18.1, 1.5]].forEach(([x, y], index) => createRoom(x, y, 1.1, .8, index % 2 ? 0x2c998e : 0xff8f36, false))

    const loader = new GLTFLoader()
    let disposed = false
    let propsLoading = false
    const propGroup = new THREE.Group()
    world.add(propGroup)
    const placeProp = async (file: string, targetHeight: number, position: [number, number, number], rotationY = 0) => {
      const { scene: source } = await loader.loadAsync(`${PROP_ROOT}/${file}`)
      if (disposed) return
      const prop = normalizeProp(source, targetHeight)
      prop.position.set(...position)
      prop.rotation.y = rotationY
      propGroup.add(prop)
    }
    const loadProps = () => {
      if (propsLoading) return
      propsLoading = true
      Promise.all([
        placeProp('desk.glb', .84, [-4.7, 1.53, -6.42], .1),
        placeProp('lampRoundTable.glb', .66, [-3.65, 1.6, -6.32], -.1),
        placeProp('plantSmall1.glb', .72, [-2.65, 1.52, -6.36], -.25),
        placeProp('loungeSofa.glb', .95, [3.4, 1.52, -6.4], -.06),
        placeProp('lampRoundFloor.glb', 1.28, [5.25, 1.52, -6.3], .18),
        placeProp('pottedPlant.glb', 1.02, [1.75, 1.52, -6.28], -.3),
        placeProp('desk.glb', .82, [-4.2, -1.4, -6.4], .12),
        placeProp('laptop.glb', .29, [-3.7, -.82, -6.2], -.12),
        placeProp('chairDesk.glb', .95, [-2.3, -1.42, -6.2], -.2),
        placeProp('bookcaseOpen.glb', 1.55, [2.0, -1.44, -6.34], .03),
        placeProp('loungeChairRelax.glb', .94, [4.05, -1.44, -6.2], -.18),
        placeProp('plantSmall2.glb', .84, [5.45, -1.44, -6.2], .2),
      ]).then(() => { if (!disposed) shell.dataset.ready = 'true' }).catch(() => { if (!disposed) shell.dataset.ready = 'error' })
    }

    let targetCamera: ApartmentFacadeState['camera'] = { x: -3.8, y: 2.8, z: 22.4, targetX: -2.2, targetY: 4.6, targetZ: -7.2 }
    const renderedCamera = { ...targetCamera }
    let targetIntensities: [number, number, number, number] = [1, .26, .26, .26]
    const renderedIntensities = [1, .26, .26, .26]
    let targetProgress = 0
    const onProgress = (event: Event) => {
      const state = (event as CustomEvent<ApartmentFacadeState>).detail
      targetCamera = state.camera
      targetIntensities = state.roomIntensities
      targetProgress = state.progress
    }
    window.addEventListener('webnest:apartment-progress', onProgress)

    let isVisible = shell.getBoundingClientRect().top < window.innerHeight && shell.getBoundingClientRect().bottom > 0
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (entry.isIntersecting) loadProps()
    }, { rootMargin: '70%' })
    visibilityObserver.observe(shell)
    if (isVisible) loadProps()

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
      const ease = reducedMotion ? 1 : .06
      ;(Object.keys(renderedCamera) as Array<keyof typeof renderedCamera>).forEach((key) => {
        renderedCamera[key] += (targetCamera[key] - renderedCamera[key]) * ease
      })
      camera.position.set(renderedCamera.x, renderedCamera.y, renderedCamera.z)
      target.set(renderedCamera.targetX, renderedCamera.targetY, renderedCamera.targetZ)
      camera.lookAt(target)
      featuredRooms.forEach((room, index) => {
        const selected = index === activePrincipleRef.current
        renderedIntensities[index] += (targetIntensities[index] - renderedIntensities[index]) * .08
        room.glow.emissiveIntensity = .16 + renderedIntensities[index] * (selected ? .38 : .27)
        room.light.intensity = 7 + renderedIntensities[index] * (selected ? 16 : 10)
        const blindTilt = reducedMotion ? 0 : Math.sin(now * .00028 + index) * .025 + targetProgress * .05
        room.blinds.rotation.x = blindTilt
        room.frame.position.z = selected && !reducedMotion ? Math.sin(now * .0024) * .018 : 0
      })
      renderer.render(scene, camera)
      frame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('webnest:apartment-progress', onProgress)
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
    <div ref={shellRef} className="apartment-facade-3d" role="img" aria-label="Real-time 3D apartment façade at night" data-ready="loading">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
