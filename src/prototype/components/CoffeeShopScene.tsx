import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowRight, GearSix, ShieldCheck, Storefront, TrendUp } from '@phosphor-icons/react'
import { getCoffeeShopState, type CoffeeShopState } from '../coffee-shop'
import { useSiteTheme } from '../SiteTheme'
import { ViewportScene } from './ViewportScene'

const CoffeeShop3D = lazy(() => import('./CoffeeShop3D').then((module) => ({ default: module.CoffeeShop3D })))

type Props = { reducedMotion: boolean }

const pillars = [
  { number: '01', title: 'Build', summary: 'Create your digital foundation.', detail: 'Business Websites · Landing Pages · E-commerce · Booking Systems', Icon: Storefront },
  { number: '02', title: 'Grow', summary: 'Help more customers discover and choose you.', detail: 'SEO · Google Visibility · Analytics · Conversion Optimisation', Icon: TrendUp },
  { number: '03', title: 'Automate', summary: 'Remove repetitive work from your business.', detail: 'WhatsApp Automation · Lead Workflows · CRM Integrations · AI Assistants', Icon: GearSix },
  { number: '04', title: 'Maintain', summary: 'Keep everything fast, secure and improving.', detail: 'Website Updates · Performance · Security · Ongoing Support', Icon: ShieldCheck },
]

export function CoffeeShopScene({ reducedMotion }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [activePillar, setActivePillar] = useState(0)
  const { theme } = useSiteTheme()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let ticking = false
    const applyState = (state: CoffeeShopState, announce = true) => {
      element.dataset.phase = state.phase
      element.style.setProperty('--coffee-progress', String(state.progress))
      element.style.setProperty('--coffee-content-opacity', String(state.contentOpacity))
      element.style.setProperty('--coffee-entry-opacity', String(Math.max(0, Math.min(1, 1 - state.progress / .16))))
      setActivePillar(state.activePillar)
      if (announce) window.dispatchEvent(new CustomEvent('webnest:coffee-progress', { detail: state }))
    }
    const render = () => {
      const rect = element.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      const visible = rect.top <= window.innerHeight && rect.bottom >= 0
      applyState(getCoffeeShopState(reducedMotion ? .5 : progress), visible)
      ticking = false
    }
    const update = () => { if (!ticking) { ticking = true; requestAnimationFrame(render) } }
    render()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [reducedMotion])

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    event.currentTarget.style.setProperty('--coffee-pointer-x', `${x * 9}px`)
    event.currentTarget.style.setProperty('--coffee-pointer-y', `${y * 6}px`)
  }

  const clearPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--coffee-pointer-x', '0px')
    event.currentTarget.style.setProperty('--coffee-pointer-y', '0px')
  }

  return (
    <section ref={ref} className="coffee-shop scene" id="coffee-shop" aria-label="Everything your business needs to grow online" data-testid="coffee-shop" data-phase="threshold" onPointerMove={onPointerMove} onPointerLeave={clearPointer} style={{ '--coffee-active-pillar': activePillar } as CSSProperties}>
      <span id="services" className="scene-anchor" aria-hidden="true" />
      <div className="coffee-shop__sticky">
        <div className="coffee-shop__camera">
          {theme === 'morning' ? <img className="coffee-shop__entry-plate" src="/assets/reference/coffee-shop-entry-morning.jpg" alt="" aria-hidden="true" /> : null}
          <ViewportScene label="coffee-shop"><Suspense fallback={null}><CoffeeShop3D reducedMotion={reducedMotion} theme={theme} /></Suspense></ViewportScene>
        </div>
        <div className="coffee-shop__shade" aria-hidden="true" />
        <div className="coffee-shop__intro">
          <p className="eyebrow"><span />What we build</p>
          <h2>Everything your<br />business needs to<br /><em>grow online.</em></h2>
          <p>From your first website to automated customer journeys, WebNest builds the digital pieces your business needs — and makes them work together.</p>
        </div>
        <aside className="coffee-shop__menu" aria-label="WebNest coffee menu">
          <strong>WEBNEST</strong><span>Digital growth system</span>
          <dl><div><dt>Espresso</dt><dd>2.50</dd></div><div><dt>Americano</dt><dd>2.80</dd></div><div><dt>Build</dt><dd>3.20</dd></div><div><dt>Grow</dt><dd>3.50</dd></div></dl>
        </aside>
        <div className="coffee-shop__pillars" aria-label="Four connected WebNest services">
          {pillars.map(({ number, title, summary, detail, Icon }, index) => (
            <button key={number} type="button" className="coffee-pillar" aria-label={`${number} ${title}: ${summary} ${detail}`} aria-pressed={activePillar === index} data-active={activePillar === index} onClick={() => setActivePillar(index)} onFocus={() => setActivePillar(index)} onPointerEnter={() => setActivePillar(index)}>
              <Icon weight="thin" aria-hidden="true" /><span><small>{number} — {title}</small><strong>{summary}</strong><em>{detail.split(' · ').map((item) => <i key={item}>{item}</i>)}</em></span>
            </button>
          ))}
        </div>
        <div className="coffee-shop__closing"><p>Build it. Grow it. Automate it. Keep it <em>working.</em></p><a href="#services">Explore all services <ArrowRight aria-hidden="true" /></a></div>
        <p className="coffee-shop__exit" aria-hidden="true">The rear door opens toward the next bloom</p>
      </div>
    </section>
  )
}
