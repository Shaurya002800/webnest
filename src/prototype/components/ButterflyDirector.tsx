import { useEffect, useRef } from 'react'
import type { ExteriorTransitionState } from '../exterior-transition'
import type { StreetSystemState } from '../street-system'
import type { CoffeeShopState } from '../coffee-shop'
import type { CherryGardenState } from '../cherry-garden'
import type { ApartmentFacadeState } from '../apartment-facade'

type Props = { reducedMotion: boolean }
type LateButterflyState = { realm: string; x: number; y: number; scale: number; rotation: number; opacity: number }

export function ButterflyDirector({ reducedMotion }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const attractionTargets = '.street-waypoint, .coffee-pillar, .cherry-journey, .apartment-principle, .process-scene__steps button'
    let attractedTo: Element | null = null
    const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))
    const resolveTarget = (node: EventTarget | null) => node instanceof Element ? node.closest(attractionTargets) : null
    const moveToward = (target: Element | null) => {
      attractedTo = target
      if (reducedMotion || !target) {
        element.style.setProperty('--flight-interaction-x', '0px')
        element.style.setProperty('--flight-interaction-y', '0px')
        element.dataset.interacting = 'false'
        return
      }
      const rect = target.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return moveToward(null)
      const xValue = Number.parseFloat(element.style.getPropertyValue('--flight-x') || getComputedStyle(element).getPropertyValue('--flight-x'))
      const yValue = Number.parseFloat(element.style.getPropertyValue('--flight-y') || getComputedStyle(element).getPropertyValue('--flight-y'))
      const xUnit = element.style.getPropertyValue('--flight-x') || getComputedStyle(element).getPropertyValue('--flight-x')
      const yUnit = element.style.getPropertyValue('--flight-y') || getComputedStyle(element).getPropertyValue('--flight-y')
      const baseX = xValue * (xUnit.includes('vw') ? window.innerWidth / 100 : 1)
      const baseY = yValue * (yUnit.includes('vh') ? window.innerHeight / 100 : 1)
      const targetX = rect.left + rect.width / 2
      const targetY = rect.top + Math.min(rect.height * .38, 44) - 34
      element.style.setProperty('--flight-interaction-x', `${clamp(targetX - baseX, window.innerWidth * .11)}px`)
      element.style.setProperty('--flight-interaction-y', `${clamp(targetY - baseY, window.innerHeight * .075)}px`)
      element.dataset.interacting = 'true'
    }
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const target = resolveTarget(event.target)
      if (target && target !== attractedTo) moveToward(target)
    }
    const onPointerOut = (event: PointerEvent) => {
      if (attractedTo && resolveTarget(event.relatedTarget) !== attractedTo) moveToward(resolveTarget(event.relatedTarget))
    }
    const onFocusIn = (event: FocusEvent) => {
      const target = resolveTarget(event.target)
      if (target) moveToward(target)
    }
    const onFocusOut = (event: FocusEvent) => {
      if (attractedTo && resolveTarget(event.relatedTarget) !== attractedTo) moveToward(resolveTarget(event.relatedTarget))
    }
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    element.style.setProperty('--flight-interaction-x', '0px')
    element.style.setProperty('--flight-interaction-y', '0px')
    const applyExteriorState = (state: ExteriorTransitionState) => {
      element.style.setProperty('--flight-x', `${state.butterfly.x}vw`)
      element.style.setProperty('--flight-y', `${state.butterfly.y}vh`)
      element.style.setProperty('--flight-scale', String(state.butterfly.scale))
      element.style.setProperty('--bank', `${state.butterfly.rotation}deg`)
      element.style.setProperty('--flight-opacity', '1')
      element.dataset.realm = state.phase
    }
    const applyStreetState = (state: StreetSystemState) => {
      element.style.setProperty('--flight-x', `${state.butterfly.x}vw`)
      element.style.setProperty('--flight-y', `${state.butterfly.y}vh`)
      element.style.setProperty('--flight-scale', String(state.butterfly.scale))
      element.style.setProperty('--bank', `${state.butterfly.rotation}deg`)
      element.style.setProperty('--flight-opacity', String(state.butterfly.opacity))
      element.dataset.realm = 'street-system'
    }
    const applyCoffeeState = (state: CoffeeShopState) => {
      element.style.setProperty('--flight-x', `${state.butterfly.x}vw`)
      element.style.setProperty('--flight-y', `${state.butterfly.y}vh`)
      element.style.setProperty('--flight-scale', String(state.butterfly.scale))
      element.style.setProperty('--bank', `${state.butterfly.rotation}deg`)
      element.style.setProperty('--flight-opacity', String(state.butterfly.opacity))
      element.dataset.realm = 'coffee-shop'
    }
    const applyCherryState = (state: CherryGardenState) => {
      element.style.setProperty('--flight-x', `${state.butterfly.x}vw`)
      element.style.setProperty('--flight-y', `${state.butterfly.y}vh`)
      element.style.setProperty('--flight-scale', String(state.butterfly.scale))
      element.style.setProperty('--bank', `${state.butterfly.rotation}deg`)
      element.style.setProperty('--flight-opacity', String(reducedMotion ? 0 : state.butterfly.opacity))
      element.dataset.realm = 'cherry-garden'
    }
    const applyApartmentState = (state: ApartmentFacadeState) => {
      element.style.setProperty('--flight-x', `${state.butterfly.x}vw`)
      element.style.setProperty('--flight-y', `${state.butterfly.y}vh`)
      element.style.setProperty('--flight-scale', String(state.butterfly.scale))
      element.style.setProperty('--bank', `${state.butterfly.rotation}deg`)
      element.style.setProperty('--flight-opacity', String(reducedMotion ? 0 : state.butterfly.opacity))
      element.dataset.realm = 'apartment-facade'
    }
    const applyLateState = (state: LateButterflyState) => {
      element.style.setProperty('--flight-x', `${state.x}vw`)
      element.style.setProperty('--flight-y', `${state.y}vh`)
      element.style.setProperty('--flight-scale', String(state.scale))
      element.style.setProperty('--bank', `${state.rotation}deg`)
      element.style.setProperty('--flight-opacity', String(reducedMotion ? 0 : state.opacity))
      element.dataset.realm = state.realm
    }
    const onExteriorProgress = (event: Event) => applyExteriorState((event as CustomEvent<ExteriorTransitionState>).detail)
    const onStreetProgress = (event: Event) => applyStreetState((event as CustomEvent<StreetSystemState>).detail)
    const onCoffeeProgress = (event: Event) => applyCoffeeState((event as CustomEvent<CoffeeShopState>).detail)
    const onCherryProgress = (event: Event) => applyCherryState((event as CustomEvent<CherryGardenState>).detail)
    const onApartmentProgress = (event: Event) => applyApartmentState((event as CustomEvent<ApartmentFacadeState>).detail)
    const onLateProgress = (event: Event) => applyLateState((event as CustomEvent<LateButterflyState>).detail)
    window.addEventListener('webnest:exterior-progress', onExteriorProgress)
    window.addEventListener('webnest:street-progress', onStreetProgress)
    window.addEventListener('webnest:coffee-progress', onCoffeeProgress)
    window.addEventListener('webnest:cherry-progress', onCherryProgress)
    window.addEventListener('webnest:apartment-progress', onApartmentProgress)
    window.addEventListener('webnest:late-progress', onLateProgress)
    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      window.removeEventListener('webnest:exterior-progress', onExteriorProgress)
      window.removeEventListener('webnest:street-progress', onStreetProgress)
      window.removeEventListener('webnest:coffee-progress', onCoffeeProgress)
      window.removeEventListener('webnest:cherry-progress', onCherryProgress)
      window.removeEventListener('webnest:apartment-progress', onApartmentProgress)
      window.removeEventListener('webnest:late-progress', onLateProgress)
    }
  }, [reducedMotion])

  return (
    <div ref={ref} className="butterfly-director" data-realm="room" aria-hidden="true">
      <img src="/assets/generated/butterfly.png" alt="" />
    </div>
  )
}
