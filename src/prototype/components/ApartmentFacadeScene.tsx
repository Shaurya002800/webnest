import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { getApartmentFacadeState, type ApartmentFacadeState } from '../apartment-facade'

type Props = { reducedMotion: boolean }

const principles = [
  { number: '01', title: 'Business first', copy: 'We understand the business problem before choosing what to build.' },
  { number: '02', title: 'Everything connected', copy: 'Website, SEO, WhatsApp, automation and customer flow work as one system.' },
  { number: '03', title: 'Built around you', copy: 'No fixed template. The solution adapts to your business and customer journey.' },
  { number: '04', title: 'Growth after launch', copy: 'Launch is only the beginning — performance is tracked, improved and expanded over time.' },
]

export function ApartmentFacadeScene({ reducedMotion }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [activePrinciple, setActivePrinciple] = useState(0)
  const [illuminatedPrinciple, setIlluminatedPrinciple] = useState<number | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let ticking = false
    let currentPrinciple = -1
    const applyState = (state: ApartmentFacadeState, announce = true) => {
      element.dataset.phase = state.phase
      element.style.setProperty('--apartment-progress', String(state.progress))
      element.style.setProperty('--apartment-content-opacity', String(state.contentOpacity))
      if (state.activePrinciple !== currentPrinciple) {
        currentPrinciple = state.activePrinciple
        setActivePrinciple(state.activePrinciple)
      }
      if (announce) window.dispatchEvent(new CustomEvent('webnest:apartment-progress', { detail: state }))
    }
    const render = () => {
      const rect = element.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      const visible = rect.top <= window.innerHeight && rect.bottom >= 0
      applyState(getApartmentFacadeState(reducedMotion ? .52 : progress), visible)
      ticking = false
    }
    const update = () => { if (!ticking) { ticking = true; requestAnimationFrame(render) } }
    render()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [reducedMotion])

  const selectPrinciple = (index: number) => {
    setActivePrinciple(index)
    window.dispatchEvent(new CustomEvent('webnest:apartment-progress', { detail: { ...getApartmentFacadeState(.2 + index * .18), activePrinciple: index } }))
  }

  const illuminatePrinciple = (index: number) => {
    selectPrinciple(index)
    setIlluminatedPrinciple(index)
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    event.currentTarget.style.setProperty('--apartment-pointer-x', `${x * 7}px`)
    event.currentTarget.style.setProperty('--apartment-pointer-y', `${y * 4}px`)
  }

  const clearPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--apartment-pointer-x', '0px')
    event.currentTarget.style.setProperty('--apartment-pointer-y', '0px')
    setIlluminatedPrinciple(null)
  }

  return (
    <section ref={ref} className="apartment-facade apartment-facade--plate scene" id="why-webnest" aria-labelledby="apartment-title" data-testid="apartment-facade" data-phase="tree-arrival" data-illuminated-window={illuminatedPrinciple ?? undefined} onPointerMove={onPointerMove} onPointerLeave={clearPointer} style={{ '--apartment-active-principle': activePrinciple } as CSSProperties}>
      <div className="apartment-facade__sticky">
        <div className="apartment-facade__camera">
          <img className="apartment-facade__plate" src="/assets/reference/apartment-facade-royal.webp" alt="Cinematic apartment façade at night" loading="lazy" decoding="async" />
        </div>
        <div className="apartment-facade__shade" aria-hidden="true" />
        <div className="apartment-facade__intro">
          <p className="eyebrow">Why WebNest</p>
          <h2 id="apartment-title" aria-label="More than a website agency.">More than a<br />website agency.</h2>
          <p>WebNest doesn't just build pages. We build connected systems around how your business actually attracts, converts and serves customers.</p>
        </div>
        <div className="apartment-facade__principles" aria-label="Why WebNest principles">
          {principles.map(({ number, title, copy }, index) => (
            <button key={title} type="button" className={`apartment-principle apartment-principle--${index + 1}`} aria-label={`${number} ${title}: ${copy}`} aria-pressed={activePrinciple === index} data-active={activePrinciple === index} data-window-active={illuminatedPrinciple === index} onClick={() => selectPrinciple(index)} onFocus={() => illuminatePrinciple(index)} onBlur={() => setIlluminatedPrinciple(null)} onPointerEnter={() => illuminatePrinciple(index)} onPointerLeave={() => setIlluminatedPrinciple(null)}>
              <strong>{number} — {title}</strong>
              <span>{copy}</span>
            </button>
          ))}
        </div>
        <p className="apartment-facade__statement">Not just something that looks good.<br />Something that <em>works for your business.</em></p>
        <a className="apartment-facade__cta" href="#process">See how WebNest works <ArrowRight aria-hidden="true" /></a>
      </div>
    </section>
  )
}
