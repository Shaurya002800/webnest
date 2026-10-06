import { useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { ThemeToggle, useSiteTheme } from '../SiteTheme'
import { getScenePlate } from '../scene-themes'

type InquiryKind = 'audit' | 'project'

export function InquiryPage({ kind }: { kind: InquiryKind }) {
  const [submitted, setSubmitted] = useState(false)
  const { theme } = useSiteTheme()
  const selectedPackage = useMemo(() => {
    const value = new URLSearchParams(window.location.search).get('package')?.toLowerCase()
    return ['starter', 'growth', 'growthos', 'custom'].includes(value || '') ? value : ''
  }, [])
  const isAudit = kind === 'audit'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
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
        {submitted ? (
          <div className="inquiry-page__success" role="status"><CheckCircle weight="thin" /><p className="eyebrow">Message prepared</p><h2>{isAudit ? 'Your audit request is ready.' : 'Your brief is ready for WebNest.'}</h2><p>This prototype has validated your details. Connect the approved email, CRM or form backend before production launch to deliver submissions.</p><a className="button button--primary" href="/">Return home <ArrowRight /></a></div>
        ) : (
          <form onSubmit={submit}>
            <div className="inquiry-page__field-row"><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label></div>
            <label>Business / company<input name="company" autoComplete="organization" /></label>
            {isAudit ? <><label>Website URL<input name="website" type="url" inputMode="url" placeholder="https://" /></label><label>Where is the biggest friction?<select name="challenge" defaultValue=""><option value="" disabled>Select one</option><option>Not enough enquiries</option><option>Website does not convert</option><option>Low Google visibility</option><option>Disconnected tools</option><option>Too much repetitive work</option><option>Not sure yet</option></select></label><label>What should we understand?<textarea name="brief" rows={4} placeholder="Share the context, customer journey or result you want." /></label></> : <><label>Starting point<select name="package" defaultValue={selectedPackage}><option value="">Help me choose</option><option value="starter">Starter</option><option value="growth">Growth</option><option value="growthos">GrowthOS</option><option value="custom">Custom</option></select></label><label>What are you trying to build?<textarea name="brief" rows={5} required placeholder="The business, the customer and the outcome..." /></label><div className="inquiry-page__field-row"><label>Budget range<select name="budget" defaultValue=""><option value="">Not decided</option><option>₹5k–₹15k</option><option>₹15k–₹30k</option><option>₹30k+</option></select></label><label>Ideal timeline<select name="timeline" defaultValue=""><option value="">Flexible</option><option>2–4 weeks</option><option>4–8 weeks</option><option>8+ weeks</option></select></label></div></>}
            <button className="button button--primary inquiry-page__submit" type="submit">{isAudit ? 'Request my audit' : 'Send project brief'} <ArrowRight /></button>
            <p className="inquiry-page__privacy">By continuing, you agree that WebNest may contact you about this request. No mailing list and no spam.</p>
          </form>
        )}
      </section>
    </main>
  )
}
