import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import {
  ArrowRight, Browser, ChartLineUp, ChatCircle, Check, ClipboardText, Code,
  MagnifyingGlass, RocketLaunch, Sparkle, Star, UserFocus, UsersThree,
} from '@phosphor-icons/react'
import { CTA_ROUTES } from '../scene-model'
import { useSiteTheme } from '../SiteTheme'
import { getScenePlate, type ScenePlateId } from '../scene-themes'

type LateRealm = 'selected-work' | 'process' | 'pricing' | 'audit' | 'faq' | 'final-room'

const projects = [
  { number: '01', name: 'Serenova', category: 'Hospitality / Booking', services: 'Website · Booking Flow · Payments', copy: 'A streamlined experience that lets customers explore services, select options and complete bookings in one flow.', accent: 'amber' },
  { number: '02', name: 'MyPerro', category: 'Pet Tech / Smart Product', services: 'Website · UI/UX · Product Experience', copy: 'A complete digital experience for a smart pet ecosystem, from product discovery to connected user interfaces.', accent: 'copper' },
  { number: '03', name: 'ModelArena', category: 'AI / Automation / Branding', services: 'Website · AI · Automation', copy: 'A focused digital system that helps users compare models, organise workflows and make decisions faster.', accent: 'cyan' },
]

const steps = [
  { number: '01', title: 'Understand', copy: 'We learn about your business, customers, goals and current online presence.', Icon: UserFocus },
  { number: '02', title: 'Plan', copy: 'We identify gaps, opportunities and the exact system you need.', Icon: ClipboardText },
  { number: '03', title: 'Build', copy: 'We create the website, workflows, integrations and required digital experience.', Icon: Code },
  { number: '04', title: 'Launch', copy: 'Everything is tested, refined and deployed.', Icon: RocketLaunch },
  { number: '05', title: 'Grow', copy: 'We track performance, improve the system and expand what works.', Icon: ChartLineUp },
]

const packages = [
  { name: 'Starter', price: '₹4,999+', copy: 'For businesses building their first professional online presence.', items: ['Business website', 'Mobile responsive', 'Contact / WhatsApp', 'Basic SEO setup', 'Deployment'] },
  { name: 'Growth', price: '₹14,999+', copy: 'For businesses focused on getting more enquiries, bookings and customers.', items: ['Custom website', 'SEO optimisation', 'Lead / booking flow', 'Analytics', 'Conversion optimisation', 'WhatsApp integration'], featured: true },
  { name: 'GrowthOS', price: '₹29,999+', copy: 'For businesses ready to connect and automate their digital operations.', items: ['Everything in Growth', 'CRM integration', 'WhatsApp automation', 'Automated follow-ups', 'AI-powered workflows', 'Payment integration'] },
]

const auditChecks = [
  { title: 'Website', copy: 'Design · Speed · Mobile experience · Trust', Icon: Browser },
  { title: 'Visibility', copy: 'Google presence · SEO · Discoverability', Icon: MagnifyingGlass },
  { title: 'Customer journey', copy: 'Enquiries · Bookings · Orders · Conversion flow', Icon: UsersThree },
  { title: 'Automation', copy: 'WhatsApp · Follow-ups · CRM · Repetitive tasks', Icon: ChatCircle },
  { title: 'Competitors', copy: 'How your online presence compares with similar businesses', Icon: ChartLineUp },
  { title: 'Opportunities', copy: 'Clear action WebNest recommends for growth', Icon: Star },
]

const faqs = [
  ['What exactly does WebNest do?', 'We build websites, growth systems, automation and digital experiences designed around how your business attracts and converts customers.'],
  ['How much does a project cost?', 'Projects depend on scope, but WebNest offers clear starting packages and custom solutions.'],
  ['Can you improve my existing website?', 'Yes. We can redesign, optimise or connect your existing website with better customer flows, SEO and automation.'],
  ['Do you provide SEO and Google optimisation?', 'Yes. Visibility and discoverability can be built into the overall WebNest system.'],
  ['Can you connect WhatsApp or automate follow-ups?', 'Yes. WhatsApp, lead workflows, reminders, CRM and automation can be integrated where useful.'],
  ["What if I don't know what I need?", "Start with the free audit. We'll identify the gaps and recommend what actually makes sense for your business."],
]

const butterflyRoutes: Record<LateRealm, { from: [number, number]; to: [number, number]; endOpacity?: number }> = {
  'selected-work': { from: [86, 22], to: [69, 31] },
  process: { from: [69, 31], to: [57, 58] },
  pricing: { from: [57, 58], to: [77, 42] },
  audit: { from: [77, 42], to: [84, 66] },
  faq: { from: [84, 66], to: [63, 44] },
  'final-room': { from: [63, 44], to: [73, 58], endOpacity: 0 },
}

function useLateScene(ref: RefObject<HTMLElement | null>, realm: LateRealm, reducedMotion: boolean) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let ticking = false
    const render = () => {
      const rect = element.getBoundingClientRect()
      const travel = Math.max(rect.height + window.innerHeight, 1)
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / travel))
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const route = butterflyRoutes[realm]
        const x = route.from[0] + (route.to[0] - route.from[0]) * progress
        const y = route.from[1] + (route.to[1] - route.from[1]) * progress
        const opacity = reducedMotion ? 0 : Math.max(0, Math.min(1, 1 + ((route.endOpacity ?? 1) - 1) * Math.max(0, (progress - .7) / .3)))
        window.dispatchEvent(new CustomEvent('webnest:late-progress', { detail: { realm, x, y, scale: .28 + Math.sin(progress * Math.PI) * .12, rotation: -8 + progress * 16, opacity } }))
        element.style.setProperty('--late-progress', String(progress))
      }
      ticking = false
    }
    const update = () => { if (!ticking) { ticking = true; requestAnimationFrame(render) } }
    render()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [realm, reducedMotion, ref])
}

function usePlatePointer(reducedMotion: boolean) {
  return (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--plate-x', `${(((event.clientX - rect.left) / rect.width) - .5) * -10}px`)
    event.currentTarget.style.setProperty('--plate-y', `${(((event.clientY - rect.top) / rect.height) - .5) * -7}px`)
  }
}

function ScenePlate({ scene, alt }: { scene: ScenePlateId; alt: string }) {
  const { theme } = useSiteTheme()
  return <div className="late-scene__camera" aria-hidden="true"><img src={getScenePlate(scene, theme)} alt={alt} loading="lazy" decoding="async" /></div>
}

export function SelectedWorkScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useLateScene(ref, 'selected-work', reducedMotion)
  const onPointerMove = usePlatePointer(reducedMotion)
  return (
    <section ref={ref} className="late-scene selected-work-scene scene" id="work" data-testid="selected-work-scene" data-active-project={active} onPointerMove={onPointerMove}>
      <ScenePlate scene="selectedWork" alt="" />
      <div className="late-scene__shade" />
      <div className="selected-work-scene__content">
        <div className="selected-work-scene__intro">
          <p className="eyebrow"><span />Selected work</p>
          <h2 aria-label="Built to solve real business problems.">Built to solve<br />real business problems.</h2>
          <p>A few examples of how WebNest turns business needs into useful digital experiences, systems and customer journeys.</p>
        </div>
        <div className="selected-work-scene__projects">
          {projects.map((project, index) => (
            <button key={project.name} type="button" className="project-panel" data-accent={project.accent} data-active={active === index} aria-pressed={active === index} onClick={() => setActive(index)} onFocus={() => setActive(index)} onPointerEnter={() => setActive(index)}>
              <span className="project-panel__number">{project.number} — {project.name}</span>
              <strong>{project.category}</strong><small>{project.services}</small>
              <span className="project-panel__rule" /><p>{project.copy}</p>
              <span className="project-panel__cta">View concept <ArrowRight /></span>
            </button>
          ))}
        </div>
        <div className="selected-work-scene__closing"><p>Good design gets attention.<br />Good systems move the <em>business forward.</em></p><a href="#process">See how we build <ArrowRight /></a></div>
      </div>
    </section>
  )
}

export function ProcessScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useLateScene(ref, 'process', reducedMotion)
  return (
    <section ref={ref} className="late-scene process-scene scene" id="process" data-testid="process-scene" data-active-step={active} onPointerMove={usePlatePointer(reducedMotion)}>
      <ScenePlate scene="process" alt="" /><div className="late-scene__shade" />
      <div className="process-scene__copy"><p className="eyebrow"><span />How it works</p><h2 aria-label="From business problem to growth system.">From business problem<br />to growth system.</h2><p>A simple process that keeps the focus on your business, your customers and what actually needs to be built.</p><div className="process-scene__flow">Understand → Plan → Build → Launch → Grow</div><a href={CTA_ROUTES.project}>Start your project <ArrowRight /></a></div>
      <div className="process-scene__steps" aria-label="WebNest process">
        {steps.map(({ number, title, copy, Icon }, index) => <button key={title} type="button" aria-label={`${number} ${title}: ${copy}`} aria-pressed={active === index} data-active={active === index} onClick={() => setActive(index)} onFocus={() => setActive(index)} onPointerEnter={() => setActive(index)}><Icon /><span><strong>{number} — {title}</strong><small>{copy}</small></span></button>)}
      </div>
    </section>
  )
}

export function PricingScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useLateScene(ref, 'pricing', reducedMotion)
  return (
    <section ref={ref} className="late-scene pricing-scene scene" id="pricing" data-testid="pricing-scene" onPointerMove={usePlatePointer(reducedMotion)}>
      <ScenePlate scene="pricing" alt="" /><div className="late-scene__shade" />
      <div className="pricing-scene__content"><div className="pricing-scene__intro"><p className="eyebrow"><span />Choose your starting point</p><h2 aria-label="Start with what your business actually needs.">Start with what your<br />business actually needs.</h2><p>Simple starting packages for different stages of growth. Every WebNest solution can be customised around your business.</p></div>
        <div className="pricing-scene__packages">{packages.map((tier, index) => <article key={tier.name} data-featured={tier.featured || undefined}><div><span>0{index + 1} — {tier.name}</span><strong>{tier.price}</strong><p>{tier.copy}</p></div><ul>{tier.items.map(item => <li key={item}><Check />{item}</li>)}</ul><a href={`${CTA_ROUTES.project}?package=${tier.name.toLowerCase()}`}>Choose {tier.name} <ArrowRight /></a></article>)}</div>
        <a className="pricing-scene__custom" href={`${CTA_ROUTES.project}?package=custom`}>Need something different? Get a custom quote <ArrowRight /></a>
      </div>
    </section>
  )
}

export function AuditScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useLateScene(ref, 'audit', reducedMotion)
  return (
    <section ref={ref} className="late-scene audit-scene scene" id="audit" data-testid="audit-scene" onPointerMove={usePlatePointer(reducedMotion)}>
      <ScenePlate scene="audit" alt="" /><div className="late-scene__shade" />
      <div className="audit-scene__content"><p className="eyebrow"><span />Start with clarity</p><h2 aria-label="Not sure what your business needs? We'll show you.">Not sure what your<br />business needs? We'll<br />show you.</h2><p>Get a free review of your current online presence and see where customers may be dropping off, what's missing, and what can be improved.</p><h3>What we check</h3><div className="audit-scene__checks">{auditChecks.map(({ title, copy, Icon }, index) => <div key={title}><Icon /><span><strong>0{index + 1} — {title}</strong><small>{copy}</small></span></div>)}</div><a className="button button--primary" href={CTA_ROUTES.audit}><Sparkle />Get my free audit <ArrowRight /></a><small>Free · No obligation · Personalised recommendations</small></div>
    </section>
  )
}

export function FaqRoadScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)
  useLateScene(ref, 'faq', reducedMotion)
  return (
    <section ref={ref} className="late-scene faq-road-scene scene" id="faq" data-testid="faq-scene" onPointerMove={usePlatePointer(reducedMotion)}>
      <ScenePlate scene="faq" alt="" /><div className="late-scene__shade" />
      <div className="faq-road-scene__content"><p className="eyebrow"><span />FAQ · Questions answered</p><h2 aria-label="Before you work with WebNest.">Before you work<br />with WebNest.</h2><p>A few things businesses usually want to know before getting started.</p><div className="faq-road-scene__list">{faqs.map(([question, answer], index) => { const expanded = open === index; return <div key={question}><button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}><span>0{index + 1} — {question}</span><span aria-hidden="true">{expanded ? '−' : '+'}</span></button><div hidden={!expanded}><p>{answer}</p></div></div> })}</div><a href="mailto:hello@webnest.in">Still have a question? Talk to WebNest <ArrowRight /></a></div>
    </section>
  )
}

export function FinalRoomScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useLateScene(ref, 'final-room', reducedMotion)
  return (
    <section ref={ref} className="late-scene final-room-scene scene" id="final-cta" data-testid="final-cta-scene" onPointerMove={usePlatePointer(reducedMotion)}>
      <ScenePlate scene="finalRoom" alt="" /><div className="late-scene__shade" />
      <div className="final-room-scene__content"><p className="eyebrow"><span />Ready when you are</p><h2 aria-label="Your next customer may already be looking for you.">Your next customer<br />may already be<br />looking for you.</h2><p>Let's make sure they find the right system—and take the next step without friction.</p><div className="hero-actions"><a className="button button--primary" href={CTA_ROUTES.audit}>Get my free audit <ArrowRight /></a><a className="button button--ghost" href={CTA_ROUTES.project}>Start a project <ArrowRight /></a></div><p className="final-room-scene__services">Websites <span /> Growth <span /> Automation <span /> AI</p><p className="final-room-scene__statement">You've built the business.<br />Now let's build the system around it.</p></div>
    </section>
  )
}

export function SiteFooter() {
  return <footer id="footer" className="footer footer--cinematic"><div className="footer__brand"><span>W</span><strong>WEBNEST</strong><p>Digital growth systems for businesses<br />that want more than just a website.</p><small>Build. Connect. Automate. Grow.</small></div><div className="footer__columns"><div><strong>Explore</strong><a href="#services">Services</a><a href="#business-solutions">Solutions</a><a href="#work">Work</a><a href="#pricing">Pricing</a></div><div><strong>Company</strong><a href="#why-webnest">About</a><a href="mailto:hello@webnest.in">Contact</a><a href={CTA_ROUTES.audit}>Free Audit</a><a href={CTA_ROUTES.project}>Start a Project</a></div><div><strong>Services</strong><a href="#services">Web Development</a><a href="#services">SEO & Growth</a><a href="#services">Automation</a><a href="#services">AI Solutions</a></div><div><strong>Contact</strong><a href="mailto:hello@webnest.in">hello@webnest.in</a><a href={CTA_ROUTES.project}>WhatsApp →</a><a href={CTA_ROUTES.project}>LinkedIn →</a><a href={CTA_ROUTES.project}>Instagram →</a></div></div><div className="footer__legal"><span>© 2026 WebNest. All rights reserved.</span><span>Privacy Policy · Terms</span><span>The end of the page. The start of something better.</span></div></footer>
}
