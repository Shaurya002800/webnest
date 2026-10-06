import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowRight, Barbell, FirstAid, FlowerLotus, ForkKnife, GraduationCap, Scissors, ShoppingBag, type Icon } from '@phosphor-icons/react'
import { getCherryGardenState, type CherryGardenState } from '../cherry-garden'
import { useSiteTheme } from '../SiteTheme'
import { getScenePlate } from '../scene-themes'

type Props = { reducedMotion: boolean }

const journeys: Array<{ number: string; title: string; items: string[]; Icon: Icon }> = [
  { number: '01', title: 'Restaurants', items: ['Digital Menu', 'Reservations', 'Online Orders', 'Google Visibility'], Icon: ForkKnife },
  { number: '02', title: 'Salons', items: ['Service Showcase', 'Appointment Booking', 'WhatsApp Integration', 'Automated Reminders'], Icon: Scissors },
  { number: '03', title: 'Clinics', items: ['Appointment Booking', 'Service Information', 'Patient Enquiries', 'Follow-ups'], Icon: FirstAid },
  { number: '04', title: 'Gyms', items: ['Membership Leads', 'Trial Bookings', 'Plans & Packages', 'Lead Follow-ups'], Icon: Barbell },
  { number: '05', title: 'Coaching', items: ['Course Pages', 'Student Enquiries', 'Counselling Bookings', 'Automated Follow-ups'], Icon: GraduationCap },
  { number: '06', title: 'Retail', items: ['Product Showcase', 'Store Discovery', 'Customer Enquiries', 'Online Selling'], Icon: ShoppingBag },
]

export function CherryGardenScene({ reducedMotion }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { theme } = useSiteTheme()
  const filmRef = useRef<HTMLVideoElement>(null)
  const [activeJourney, setActiveJourney] = useState(0)
  const [filmEnabled, setFilmEnabled] = useState(false)

  useEffect(() => {
    const element = ref.current
    const film = filmRef.current
    if (!element || !film || reducedMotion) return
    if (typeof IntersectionObserver === 'undefined') {
      setFilmEnabled(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setFilmEnabled(true)
        const playback = film.play()
        playback?.catch(() => undefined)
      } else {
        film.pause()
      }
    }, { rootMargin: '120px 0px', threshold: .01 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [filmEnabled, reducedMotion])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let ticking = false
    let currentJourney = -1
    const applyState = (state: CherryGardenState, announce = true) => {
      element.dataset.phase = state.phase
      element.style.setProperty('--cherry-progress', String(state.progress))
      element.style.setProperty('--cherry-content-opacity', String(state.contentOpacity))
      element.style.setProperty('--petal-intensity', String(state.petalIntensity))
      if (state.activeJourney !== currentJourney) {
        currentJourney = state.activeJourney
        setActiveJourney(state.activeJourney)
      }
      if (announce) window.dispatchEvent(new CustomEvent('webnest:cherry-progress', { detail: state }))
    }
    const render = () => {
      const rect = element.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      const visible = rect.top <= window.innerHeight && rect.bottom >= 0
      applyState(getCherryGardenState(reducedMotion ? .52 : progress), visible)
      ticking = false
    }
    const update = () => { if (!ticking) { ticking = true; requestAnimationFrame(render) } }
    render()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [reducedMotion])

  const selectJourney = (index: number) => {
    setActiveJourney(index)
    window.dispatchEvent(new CustomEvent('webnest:cherry-progress', { detail: { ...getCherryGardenState(.18 + index * .12), activeJourney: index } }))
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    event.currentTarget.style.setProperty('--cherry-pointer-x', `${x * 8}px`)
    event.currentTarget.style.setProperty('--cherry-pointer-y', `${y * 5}px`)
  }

  const clearPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--cherry-pointer-x', '0px')
    event.currentTarget.style.setProperty('--cherry-pointer-y', '0px')
  }

  return (
    <section ref={ref} className="cherry-garden cherry-garden--media scene" id="industries" aria-labelledby="cherry-title" data-testid="cherry-garden" data-phase="doorway" onPointerMove={onPointerMove} onPointerLeave={clearPointer} style={{ '--cherry-active-journey': activeJourney } as CSSProperties}>
      <div className="cherry-garden__sticky">
        <div className="cherry-garden__camera" aria-hidden="true">
          <img className="cherry-garden__plate" src={getScenePlate('cherryGarden', theme)} alt="" loading="lazy" decoding="async" />
          <video ref={filmRef} className="cherry-garden__film" src={filmEnabled ? '/assets/generated/cherry-petal-slow.mp4' : undefined} autoPlay loop muted playsInline preload="none" data-motion="slow-petals" data-ready="loading" onCanPlay={(event) => { event.currentTarget.dataset.ready = 'true' }} />
        </div>
        <div className="cherry-garden__shade" aria-hidden="true" />
        <div className="cherry-garden__intro">
          <p className="eyebrow"><span />Built for real businesses</p>
          <h2 id="cherry-title">Different businesses.<br />Different needs.<br /><em>One WebNest.</em></h2>
          <p>WebNest adapts the system around how your customers discover, contact and buy from your business.</p>
        </div>
        <div className="cherry-garden__journeys" aria-label="Business journeys">
          {journeys.map(({ number, title, items, Icon }, index) => (
            <button key={title} type="button" className={`cherry-journey cherry-journey--${index + 1}`} aria-label={`${number} ${title}: ${items.join(', ')}`} aria-pressed={activeJourney === index} data-active={activeJourney === index} onClick={() => selectJourney(index)} onFocus={() => selectJourney(index)} onPointerEnter={() => selectJourney(index)}>
              <Icon weight="thin" aria-hidden="true" />
              <span><strong>{number} — {title}</strong><em>{items.map((item) => <i key={item}>{item}</i>)}</em></span>
            </button>
          ))}
        </div>
        <div className="cherry-garden__closing">
          <FlowerLotus weight="thin" aria-hidden="true" />
          <p>Your business has its own customer journey.<br /><em>Your digital system should too.</em></p>
          <a href="#industries">Explore business solutions <ArrowRight aria-hidden="true" /></a>
        </div>
        <p className="cherry-garden__exit" aria-hidden="true">Follow the butterfly toward the lit windows</p>
      </div>
    </section>
  )
}
