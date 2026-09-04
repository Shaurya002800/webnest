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
