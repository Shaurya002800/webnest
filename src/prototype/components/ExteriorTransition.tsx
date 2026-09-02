import { type ReactNode, useEffect, useRef } from 'react'
import { getExteriorTransitionState } from '../exterior-transition'
import { getSceneById } from '../scene-model'

const problems = [
  { number: '01', title: 'A brand that blends in', detail: 'Attention disappears when the story looks and sounds like everyone else.' },
  { number: '02', title: 'A website that does not convert', detail: 'Beautiful surfaces cannot rescue a journey with no clear next step.' },
  { number: '03', title: 'Marketing without a system', detail: 'Disconnected campaigns create activity, not compounding momentum.' },
]

type Props = { reducedMotion: boolean; children: ReactNode }

export function ExteriorTransition({ reducedMotion, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const scene = getSceneById('problems')!

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let ticking = false

    const render = () => {
      const rect = element.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      const state = getExteriorTransitionState(progress)
      element.dataset.phase = state.phase
      element.dataset.heroHidden = state.heroOpacity <= .02 ? 'true' : 'false'
      element.style.setProperty('--transition-progress', String(progress))
      element.style.setProperty('--camera-scale', String(state.cameraScale))
      element.style.setProperty('--hero-content-opacity', String(state.heroOpacity))
      element.style.setProperty('--flame-opacity', String(state.flameOpacity))
      element.style.setProperty('--room-opacity', String(state.roomOpacity))
      element.style.setProperty('--building-opacity', String(state.buildingOpacity))
      element.style.setProperty('--problem-content-opacity', String(state.contentOpacity))
      element.style.setProperty('--note-one', String(state.notes[0]))
      element.style.setProperty('--note-two', String(state.notes[1]))
      element.style.setProperty('--note-three', String(state.notes[2]))
      window.dispatchEvent(new CustomEvent('webnest:exterior-progress', { detail: state }))
      ticking = false
    }

    const update = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(render) }
    }
    render()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [reducedMotion])

  return (
    <section ref={ref} className="exterior-transition hero-journey scene" id="hero" aria-labelledby="hero-title" data-testid="hero-exterior-journey" data-phase="room">
      <div className="exterior-sticky">
        <div className="exterior-camera">
          <img className="exterior-room" src="/assets/generated/hero-room-clean.png" alt="A candlelit studio overlooking a city at night" />
          <img className="exterior-building" src="/assets/generated/building-night.png" alt="Night building outside the studio window" />
          <div className="exterior-vignette" aria-hidden="true" />
        </div>
        <div className="journey-hero-shade" aria-hidden="true" />
        {children}
        <div className="exterior-copy">
          <p className="eyebrow"><span />{scene.eyebrow}</p>
          <h2>{scene.title}</h2>
          <p className="scene-copy">{scene.description}</p>
        </div>
        <div className="building-problems" aria-label="Common growth problems">
          {problems.map((problem, index) => (
            <article className={`building-problem building-problem--${index + 1}`} key={problem.number}>
              <span>{problem.number}</span><h3>{problem.title}</h3><p>{problem.detail}</p>
            </article>
          ))}
        </div>
        <p className="exterior-progress" aria-hidden="true"><span>Inside</span><i /><span>Outside</span></p>
      </div>
      <span className="problem-anchor" id="problems" aria-hidden="true" />
    </section>
  )
}
