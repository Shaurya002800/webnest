import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, List, X,
} from '@phosphor-icons/react'
import { CTA_ROUTES, SCENES } from '../scene-model'
import { ThemeToggle } from '../SiteTheme'
import { getMotionPolicy } from '../motion-policy'
import { ButterflyDirector } from './ButterflyDirector'
import { ExteriorTransition } from './ExteriorTransition'
import { StreetSystem } from './StreetSystem'
import { CoffeeShopScene } from './CoffeeShopScene'
import { CherryGardenScene } from './CherryGardenScene'
import { ApartmentFacadeScene } from './ApartmentFacadeScene'
import {
  AuditScene, FaqRoadScene, FinalRoomScene, PricingScene, ProcessScene,
  SelectedWorkScene, SiteFooter,
} from './LateJourneyScenes'

function useMotionPolicy() {
  const [state, setState] = useState(() => ({ width: typeof window === 'undefined' ? 1440 : window.innerWidth, reducedMotion: false }))
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setState({ width: window.innerWidth, reducedMotion: media.matches })
    update()
    window.addEventListener('resize', update)
    media.addEventListener?.('change', update)
    return () => { window.removeEventListener('resize', update); media.removeEventListener?.('change', update) }
  }, [])
  return useMemo(() => getMotionPolicy({ ...state, lowPower: false }), [state])
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="WebNest home"><span>W</span> WebNest</a>
      <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
        <a href="#services" onClick={() => setOpen(false)}>Services</a><a href="#work" onClick={() => setOpen(false)}>Work</a><a href="#process" onClick={() => setOpen(false)}>Process</a><a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
      </nav>
      <div className="site-header__actions">
        <ThemeToggle />
        <a className="header-cta" href={CTA_ROUTES.audit}>Free audit <ArrowRight weight="bold" /></a>
        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <List />}</button>
      </div>
    </header>
  )
}

export function Homepage() {
  const motion = useMotionPolicy()

  return <div className={`webnest motion-${motion.tier}`}>
    <a className="skip-link" href="#main">Skip to content</a><Header /><ButterflyDirector reducedMotion={!motion.continuousFlight} />
    <main id="main">
      <ExteriorTransition reducedMotion={motion.tier === 'still'}>
        <div className="hero-content"><p className="eyebrow"><span />{SCENES[0].eyebrow}</p><h1 id="hero-title">Where brands<br /><em>become worlds.</em></h1><p>{SCENES[0].description}</p><div className="hero-actions"><a className="button button--primary" href={CTA_ROUTES.audit}>Get a free audit <ArrowRight weight="bold" /></a><a className="button button--ghost" href={CTA_ROUTES.project}>Start a project</a></div></div>
        <a className="scroll-cue" href="#problems"><span>Follow the light</span><ArrowDown /></a>
      </ExteriorTransition>

      <StreetSystem reducedMotion={motion.tier === 'still'} />
      <CoffeeShopScene reducedMotion={motion.tier === 'still'} />
      <CherryGardenScene reducedMotion={motion.tier === 'still'} />
      <ApartmentFacadeScene reducedMotion={motion.tier === 'still'} />
      <SelectedWorkScene reducedMotion={motion.tier === 'still'} />
      <ProcessScene reducedMotion={motion.tier === 'still'} />
      <PricingScene reducedMotion={motion.tier === 'still'} />
      <AuditScene reducedMotion={motion.tier === 'still'} />
      <FaqRoadScene reducedMotion={motion.tier === 'still'} />
      <FinalRoomScene reducedMotion={motion.tier === 'still'} />
    </main>
    <SiteFooter />
  </div>
}
