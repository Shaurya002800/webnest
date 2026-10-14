import { useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { ThemeToggle, useSiteTheme } from '../SiteTheme'
import { getScenePlate } from '../scene-themes'
import { trackAnalytics } from '../analytics'

type InquiryKind = 'audit' | 'project'

export function InquiryPage({ kind }: { kind: InquiryKind }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<{ reference: string; whatsAppUrl?: string | null } | null>(null)
  const openedAt = useRef(Date.now())
  const { theme } = useSiteTheme()
  const queryContext = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const pick = (name: string, allowed: string[]) => {
      const value = params.get(name)?.toLowerCase() || ''
      return allowed.includes(value) ? value : ''
    }
    return {
      package: pick('package', ['starter', 'growth', 'growthos', 'custom']),
      service: pick('service', ['build', 'grow', 'automate', 'maintain']),
      industry: pick('industry', ['restaurant', 'salon', 'clinic', 'gym', 'coaching', 'retail', 'other']),
    }
  }, [])
  const isAudit = kind === 'audit'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    trackAnalytics('inquiry_submit_started', { kind })
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, openedAt: openedAt.current, fields: values }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'We could not send your request. Please try again.')
      setReceipt({ reference: result.reference, whatsAppUrl: result.whatsAppUrl })
      setStatus('success')
      trackAnalytics('inquiry_submit_succeeded', { kind })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not send your request. Please try again.')
      setStatus('error')
      trackAnalytics('inquiry_submit_failed', { kind })
    }
  }

  return (
    <main className="inquiry-page">
      <img className="inquiry-page__plate" src={getScenePlate('finalRoom', theme)} alt="" />
      <div className="inquiry-page__shade" />
      <ThemeToggle className="theme-toggle--inquiry" />
      <a className="inquiry-page__back" href="/"><ArrowLeft />Back to the journey</a>
      <section className="inquiry-page__intro" aria-labelledby="inquiry-title">
        <p className="eyebrow"><span />{isAudit ? 'Free growth audit' : 'Start a project'}</p>
        <h1 id="inquiry-title">{isAudit ? 'See what your business needs next.' : 'Build the right system around your business.'}</h1>
        <p>{isAudit ? 'Tell us where you are today. We will review the visible customer journey and return with focused priorities—not a generic sales deck.' : 'Give us the ambition, the constraint and the outcome. We will use it to shape the right starting point.'}</p>
        <div className="inquiry-page__promise"><CheckCircle />{isAudit ? 'Free · No obligation · Personalised recommendations' : 'Clear scope · Honest recommendations · Connected execution'}</div>
      </section>
      <section className="inquiry-page__panel" aria-label={isAudit ? 'Free audit form' : 'Project enquiry form'}>
        {status === 'success' ? (
          <div className="inquiry-page__success" role="status"><CheckCircle weight="thin" /><p className="eyebrow">Request received</p><h2>{isAudit ? 'Your audit request is with WebNest.' : 'Your brief is with WebNest.'}</h2><p>Reference <strong>{receipt?.reference}</strong>. Keep it for future messages. We will review what you shared and use your preferred contact method.</p>{receipt?.whatsAppUrl ? <a className="button button--primary" href={`${receipt.whatsAppUrl}${receipt.whatsAppUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(`Hello WebNest, I just submitted request ${receipt.reference}.`)}`}>Continue on WhatsApp <ArrowRight /></a> : <a className="button button--primary" href="/">Return home <ArrowRight /></a>}</div>
        ) : (
          <form onSubmit={submit}>
            <label className="inquiry-page__honeypot" aria-hidden="true">Leave this field empty<input name="website_confirm" tabIndex={-1} autoComplete="off" /></label>
            <div className="inquiry-page__field-row"><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label></div>
            <div className="inquiry-page__field-row"><label>WhatsApp / phone<input name="phone" type="tel" autoComplete="tel" placeholder="Optional" /></label><label>Preferred contact<select name="contact_preference" defaultValue="email"><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="phone">Phone call</option></select></label></div>
            <label>Business / company<input name="company" autoComplete="organization" /></label>
            {isAudit ? <><label>Website URL<input name="website" type="url" inputMode="url" placeholder="https://" /></label><label>Where is the biggest friction?<select name="challenge" defaultValue=""><option value="" disabled>Select one</option><option>Not enough enquiries</option><option>Website does not convert</option><option>Low Google visibility</option><option>Disconnected tools</option><option>Too much repetitive work</option><option>Not sure yet</option></select></label><label>What should we understand?<textarea name="brief" rows={4} placeholder="Share the context, customer journey or result you want." /></label></> : <><div className="inquiry-page__field-row"><label>Starting point<select name="package" defaultValue={queryContext.package}><option value="">Help me choose</option><option value="starter">Starter</option><option value="growth">Growth</option><option value="growthos">GrowthOS</option><option value="custom">Custom</option></select></label><label>Primary service<select name="service" defaultValue={queryContext.service}><option value="">Help me choose</option><option value="build">Build</option><option value="grow">Grow</option><option value="automate">Automate</option><option value="maintain">Maintain</option></select></label></div><label>Industry<select name="industry" defaultValue={queryContext.industry}><option value="">Select if relevant</option><option value="restaurant">Restaurant</option><option value="salon">Salon</option><option value="clinic">Clinic</option><option value="gym">Gym</option><option value="coaching">Coaching</option><option value="retail">Retail</option><option value="other">Other</option></select></label><label>What are you trying to build?<textarea name="brief" rows={5} required placeholder="The business, the customer and the outcome..." /></label><label>Website or reference link<input name="reference" type="url" inputMode="url" placeholder="https://" /></label><div className="inquiry-page__field-row"><label>Budget range<select name="budget" defaultValue=""><option value="">Not decided</option><option>₹5k–₹15k</option><option>₹15k–₹30k</option><option>₹30k+</option></select></label><label>Ideal timeline<select name="timeline" defaultValue=""><option value="">Flexible</option><option>2–4 weeks</option><option>4–8 weeks</option><option>8+ weeks</option></select></label></div></>}
            {status === 'error' ? <p className="inquiry-page__error" role="alert">{error}</p> : null}
            <button className="button button--primary inquiry-page__submit" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : isAudit ? 'Request my audit' : 'Send project brief'} <ArrowRight /></button>
            <p className="inquiry-page__privacy">By continuing, you agree that WebNest may contact you about this request. Read our <a href="/privacy">privacy policy</a>. No mailing list and no spam.</p>
          </form>
        )}
      </section>
    </main>
  )
}
