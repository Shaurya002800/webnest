import { useEffect, useRef } from 'react'
import type { ExteriorTransitionState } from '../exterior-transition'
import type { StreetSystemState } from '../street-system'
import type { CoffeeShopState } from '../coffee-shop'
import type { CherryGardenState } from '../cherry-garden'
import type { ApartmentFacadeState } from '../apartment-facade'

type Props = { reducedMotion: boolean }

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
      element.style.setProperty('--flight-opacity', '0')
      element.dataset.realm = 'cherry-garden'
    }
    const applyApartmentState = (state: ApartmentFacadeState) => {
      element.style.setProperty('--flight-x', `${state.butterfly.x}vw`)
      element.style.setProperty('--flight-y', `${state.butterfly.y}vh`)
      element.style.setProperty('--flight-scale', String(state.butterfly.scale))
      element.style.setProperty('--bank', `${state.butterfly.rotation}deg`)
      element.style.setProperty('--flight-opacity', '0')
      element.dataset.realm = 'apartment-facade'
    }
    const onExteriorProgress = (event: Event) => applyExteriorState((event as CustomEvent<ExteriorTransitionState>).detail)
    const onStreetProgress = (event: Event) => applyStreetState((event as CustomEvent<StreetSystemState>).detail)
    const onCoffeeProgress = (event: Event) => applyCoffeeState((event as CustomEvent<CoffeeShopState>).detail)
    const onCherryProgress = (event: Event) => applyCherryState((event as CustomEvent<CherryGardenState>).detail)
    const onApartmentProgress = (event: Event) => applyApartmentState((event as CustomEvent<ApartmentFacadeState>).detail)
    window.addEventListener('webnest:exterior-progress', onExteriorProgress)
    window.addEventListener('webnest:street-progress', onStreetProgress)
    window.addEventListener('webnest:coffee-progress', onCoffeeProgress)
    window.addEventListener('webnest:cherry-progress', onCherryProgress)
    window.addEventListener('webnest:apartment-progress', onApartmentProgress)
    return () => {
      window.removeEventListener('webnest:exterior-progress', onExteriorProgress)
      window.removeEventListener('webnest:street-progress', onStreetProgress)
      window.removeEventListener('webnest:coffee-progress', onCoffeeProgress)
      window.removeEventListener('webnest:cherry-progress', onCherryProgress)
      window.removeEventListener('webnest:apartment-progress', onApartmentProgress)
    }
  }, [reducedMotion])

  return (
    <div ref={ref} className="butterfly-director" data-realm="room" aria-hidden="true">
      <img src="/assets/generated/butterfly.png" alt="" />
    </div>
  )
}
