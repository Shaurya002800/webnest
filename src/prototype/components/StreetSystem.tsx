import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import {
  ArrowRight, ChartLineUp, ChatCircleDots, CursorClick, GearSix, MagnifyingGlass, ShieldCheck,
} from '@phosphor-icons/react'
import { getStreetSystemState, type StreetSystemState } from '../street-system'
import { useSiteTheme } from '../SiteTheme'
import { ViewportScene } from './ViewportScene'

const StreetCity3D = lazy(() => import('./StreetCity3D').then((module) => ({ default: module.StreetCity3D })))

const steps = [
  { number: '01', title: 'Get discovered', detail: 'Google · Social media · Ads · SEO', Icon: MagnifyingGlass },
  { number: '02', title: 'Build trust', detail: 'Website · Branding · Clear information', Icon: ShieldCheck },
  { number: '03', title: 'Capture action', detail: 'Enquiries · Bookings · Lead forms', Icon: CursorClick },
  { number: '04', title: 'Connect', detail: 'WhatsApp · CRM · Customer data', Icon: ChatCircleDots },
  { number: '05', title: 'Automate', detail: 'Follow-ups · Reminders · AI workflows', Icon: GearSix },
  { number: '06', title: 'Grow', detail: 'Analytics · Insights · Optimisation', Icon: ChartLineUp },
]

type Props = { reducedMotion: boolean }

export function StreetSystem({ reducedMotion }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const { theme } = useSiteTheme()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let ticking = false

    const applyState = (state: StreetSystemState, announce = true) => {
      element.dataset.phase = state.phase
      element.style.setProperty('--street-progress', String(state.routeProgress))
      element.style.setProperty('--street-route-mask', `${(1 - state.routeProgress) * 100}%`)
      element.style.setProperty('--street-camera-scale', String(state.camera.scale))
      element.style.setProperty('--street-camera-x', `${state.camera.x}%`)
      element.style.setProperty('--street-camera-y', `${state.camera.y}%`)
      element.style.setProperty('--street-camera-tilt', `${state.camera.tilt}deg`)
      element.style.setProperty('--street-arrival-opacity', String(Math.max(0, Math.min(1, 1 - state.routeProgress / .47))))
      setActiveStep(state.activeStep)
      if (announce) window.dispatchEvent(new CustomEvent('webnest:street-progress', { detail: state }))
    }

    const render = () => {
      const rect = element.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      const visible = rect.top <= window.innerHeight && rect.bottom >= 0
      applyState(getStreetSystemState(reducedMotion ? .5 : progress), visible)
      ticking = false
    }

    const update = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(render) }
    }

    render()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [reducedMotion])

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    event.currentTarget.style.setProperty('--street-pointer-x', `${x * 10}px`)
    event.currentTarget.style.setProperty('--street-pointer-y', `${y * 7}px`)
  }

  const clearPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--street-pointer-x', '0px')
    event.currentTarget.style.setProperty('--street-pointer-y', '0px')
  }

  return (
    <section
      ref={ref}
      className="street-system scene"
      id="system"
      aria-label="Connected online business system"
      data-testid="street-system"
      data-phase="arrival"
      onPointerMove={onPointerMove}
      onPointerLeave={clearPointer}
      style={{ '--street-active-step': activeStep } as CSSProperties}
    >
      <div className="street-system__sticky">
        <div className="street-system__camera">
          {theme === 'morning' ? <img className="street-system__arrival-plate" src="/assets/reference/street-arrival-morning.jpg" alt="" aria-hidden="true" /> : null}
          <ViewportScene label="street-city"><Suspense fallback={null}><StreetCity3D reducedMotion={reducedMotion} theme={theme} /></Suspense></ViewportScene>
        </div>
        <img className="street-system__route" src="/assets/generated/street-route.png" alt="" aria-hidden="true" />
        <div className="street-system__shade" aria-hidden="true" />

        <div className="street-system__intro">
          <p className="eyebrow"><span />How WebNest fixes it</p>
          <h2 id="street-system-title">One connected system for your entire <em>online business.</em></h2>
          <p>WebNest connects discovery, website, enquiries, automation and customer growth into one continuous system.</p>
          <div className="street-system__sequence" aria-label="System sequence">
            {['Discover', 'Trust', 'Convert', 'Connect', 'Automate', 'Grow'].map((label, index) => (
              <span key={label} className={index <= activeStep ? 'is-active' : ''}>{label}</span>
            ))}
          </div>
          <p className="street-system__promise"><strong>Not six separate services.</strong> One system built around your business.</p>
          <a className="street-system__cta" href="#services">Explore what WebNest builds <ArrowRight aria-hidden="true" /></a>
        </div>

        <div className="street-system__waypoints" aria-label="Six connected growth stages">
          {steps.map(({ number, title, detail, Icon }, index) => (
            <button
              key={number}
              type="button"
              className={`street-waypoint street-waypoint--${index + 1}`}
              aria-label={`${number} ${title}: ${detail}`}
              aria-pressed={activeStep === index}
              data-active={activeStep === index}
              data-complete={index < activeStep}
              onClick={() => setActiveStep(index)}
              onFocus={() => setActiveStep(index)}
              onPointerEnter={() => setActiveStep(index)}
            >
              <Icon weight="thin" aria-hidden="true" />
              <span><small>{number}</small><strong>{title}</strong><em>{detail}</em></span>
            </button>
          ))}
        </div>

        <p className="street-system__exit" aria-hidden="true">Follow the signal toward the next door</p>
      </div>
    </section>
  )
}
