import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, Check, Code, Compass, GlobeHemisphereWest, List,
  Minus, Palette, Plus, X,
} from '@phosphor-icons/react'
import { CTA_ROUTES, SCENES, getSceneById } from '../scene-model'
import { getMotionPolicy } from '../motion-policy'
import { ButterflyDirector } from './ButterflyDirector'
import { LiveFlame } from './LiveFlame'
import { ExteriorTransition } from './ExteriorTransition'
import { StreetSystem } from './StreetSystem'
import { CoffeeShopScene } from './CoffeeShopScene'
import { CherryGardenScene } from './CherryGardenScene'
import { ApartmentFacadeScene } from './ApartmentFacadeScene'

const services = [
  { icon: Compass, title: 'Brand strategy', copy: 'Positioning, audience clarity and a plan your whole team can use.' },
  { icon: Palette, title: 'Identity design', copy: 'Distinctive visual systems built to feel coherent everywhere.' },
  { icon: Code, title: 'Web experiences', copy: 'Fast, cinematic websites designed around real customer decisions.' },
  { icon: GlobeHemisphereWest, title: 'Growth systems', copy: 'Content, campaigns and automation connected to measurable goals.' },
]
const industries = ['Startups', 'Hospitality', 'Professional services', 'Creators', 'Wellness', 'E-commerce']
const process = [
  ['01', 'Discover', 'We learn the business, the audience and what progress must look like.'],
  ['02', 'Define', 'We shape the strategy, story and system before pixels become expensive.'],
  ['03', 'Design', 'We build the visual world and test it against real moments of use.'],
  ['04', 'Deliver', 'We launch, measure and leave you with a system that can keep growing.'],
]
const packages = [
  { name: 'Foundation', price: '₹45k+', copy: 'For new ideas that need a sharp, credible beginning.', items: ['Positioning sprint', 'Visual identity', 'One-page website'] },
  { name: 'Growth', price: '₹95k+', copy: 'For brands ready to connect identity, website and acquisition.', items: ['Full brand system', 'Conversion website', 'Launch campaign'], featured: true },
  { name: 'Partnership', price: 'Custom', copy: 'For ambitious teams that need an embedded creative partner.', items: ['Monthly roadmap', 'Design and development', 'Growth experiments'] },
]
const faqs = [
  ['How long does a project take?', 'Most focused builds launch in 4–8 weeks. Larger brand and platform engagements are planned in clear phases.'],
  ['Can you work with an existing brand?', 'Yes. We can strengthen the system you already have, or identify where a more fundamental reset will create better results.'],
  ['Do you only build websites?', 'No. WebNest connects strategy, identity, website and growth so the experience feels like one brand rather than separate vendors.'],
  ['What happens after launch?', 'We can hand over a clear operating system or continue as a growth partner through ongoing design, content and optimisation.'],
]

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
      <a className="header-cta" href={CTA_ROUTES.audit}>Free audit <ArrowRight weight="bold" /></a>
      <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <List />}</button>
    </header>
  )
}

function SceneHeading({ id, align = 'left' }: { id: Parameters<typeof getSceneById>[0], align?: 'left' | 'center' }) {
  const scene = getSceneById(id)!
  return <div className={`scene-heading scene-heading--${align}`}><p className="eyebrow"><span />{scene.eyebrow}</p><h2>{scene.title}</h2><p className="scene-copy">{scene.description}</p></div>
}

function Faq() {
  const [open, setOpen] = useState(-1)
  return <div className="faq-list">{faqs.map(([question, answer], index) => {
    const expanded = open === index
    return <div className="faq-item" key={question}><button aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}><span>{question}</span>{expanded ? <Minus /> : <Plus />}</button><div className="faq-answer" hidden={!expanded}><p>{answer}</p></div></div>
  })}</div>
}

export function Homepage() {
  const motion = useMotionPolicy()

  return <div className={`webnest motion-${motion.tier}`}>
    <a className="skip-link" href="#main">Skip to content</a><Header /><ButterflyDirector reducedMotion={!motion.continuousFlight} />
    <main id="main">
      <ExteriorTransition reducedMotion={motion.tier === 'still'}>
        <div className="hero-content"><p className="eyebrow"><span />{SCENES[0].eyebrow}</p><h1 id="hero-title">Where brands<br /><em>become worlds.</em></h1><p>{SCENES[0].description}</p><div className="hero-actions"><a className="button button--primary" href={CTA_ROUTES.audit}>Get a free audit <ArrowRight weight="bold" /></a><a className="button button--ghost" href={CTA_ROUTES.project}>Start a project</a></div></div>
        <LiveFlame reducedMotion={motion.tier === 'still'} /><a className="scroll-cue" href="#problems"><span>Follow the light</span><ArrowDown /></a>
      </ExteriorTransition>

      <StreetSystem reducedMotion={motion.tier === 'still'} />
      <CoffeeShopScene reducedMotion={motion.tier === 'still'} />
      <CherryGardenScene reducedMotion={motion.tier === 'still'} />
      <ApartmentFacadeScene reducedMotion={motion.tier === 'still'} />

      <section className="services scene" id="services"><div className="scene-shell"><SceneHeading id="services" /><div className="service-grid">{services.map(({ icon: Icon, title, copy }, index) => <article className="service-card" key={title}><span className="service-index">0{index + 1}</span><Icon /><h3>{title}</h3><p>{copy}</p><a href={`${CTA_ROUTES.project}?service=${encodeURIComponent(title)}`}>Explore <ArrowRight /></a></article>)}</div></div></section>

      <section className="industries scene" id="industries"><div className="scene-shell industry-layout"><SceneHeading id="industries" /><div className="industry-list">{industries.map((industry, index) => <a key={industry} href={`${CTA_ROUTES.project}?industry=${encodeURIComponent(industry)}`}><span>0{index + 1}</span>{industry}<ArrowRight /></a>)}</div></div></section>

      <section className="work scene" id="work"><div className="scene-shell"><SceneHeading id="work" /><div className="work-grid"><article className="work-card work-card--one"><div className="work-mark">A</div><p>Identity · Hospitality</p><h3>Aster House</h3><span>+64% direct enquiries</span></article><article className="work-card work-card--two"><div className="work-mark">nami</div><p>Digital · Wellness</p><h3>Nami Rituals</h3><span>2.3× conversion rate</span></article><article className="work-card work-card--three"><div className="work-mark">N/01</div><p>Platform · Technology</p><h3>Northstar OS</h3><span>Launch in 7 weeks</span></article></div></div></section>

      <section className="process scene" id="process"><div className="scene-shell"><SceneHeading id="process" /><ol className="process-list">{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></section>

      <section className="pricing scene" id="pricing"><div className="scene-shell"><SceneHeading id="pricing" align="center" /><div className="pricing-grid">{packages.map((tier) => <article key={tier.name} className={tier.featured ? 'price-card is-featured' : 'price-card'}>{tier.featured && <span className="popular">Most popular</span>}<h3>{tier.name}</h3><p className="price">{tier.price}</p><p>{tier.copy}</p><ul>{tier.items.map((item) => <li key={item}><Check />{item}</li>)}</ul><a className={tier.featured ? 'button button--primary' : 'button button--ghost'} href={`${CTA_ROUTES.project}?package=${tier.name.toLowerCase()}`}>Choose {tier.name}</a></article>)}</div></div></section>

      <section className="audit scene" id="audit"><div className="scene-shell audit-panel"><div><SceneHeading id="audit" /><div className="audit-points"><span><Check />Positioning gaps</span><span><Check />Conversion blockers</span><span><Check />Priority opportunities</span></div></div><div className="audit-action"><p>Free · No obligation · Delivered in 3 working days</p><a className="button button--primary" href={CTA_ROUTES.audit}>Get my free audit <ArrowRight /></a></div></div></section>

      <section className="faq scene" id="faq"><div className="scene-shell faq-layout"><SceneHeading id="faq" /><Faq /></div></section>
      <section className="final-cta scene" id="final-cta"><div className="scene-shell final-content"><p className="eyebrow"><span />{getSceneById('final-cta')!.eyebrow}</p><h2>{getSceneById('final-cta')!.title}</h2><p>{getSceneById('final-cta')!.description}</p><div className="hero-actions"><a className="button button--primary" href={CTA_ROUTES.project}>Start a project <ArrowRight /></a><a className="button button--ghost" href={CTA_ROUTES.audit}>Get a free audit</a></div></div></section>
    </main>
    <footer id="footer" className="footer"><div className="footer-top"><a className="brand" href="#hero"><span>W</span> WebNest</a><p>Strategy, identity and digital experiences<br />for growing brands.</p><a href="mailto:hello@webnest.studio">hello@webnest.studio</a></div><div className="footer-bottom"><span>© 2026 WebNest Studio</span><div><a href="#services">Services</a><a href="#work">Work</a><a href="#faq">FAQ</a></div><span>Made after dark.</span></div></footer>
  </div>
}
