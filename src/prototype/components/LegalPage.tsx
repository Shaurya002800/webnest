import { ArrowLeft } from '@phosphor-icons/react'
import { ThemeToggle } from '../SiteTheme'

type LegalKind = 'privacy' | 'terms'

export function LegalPage({ kind }: { kind: LegalKind }) {
  const isPrivacy = kind === 'privacy'
  return <main className="legal-page">
    <ThemeToggle className="theme-toggle--inquiry" />
    <a className="inquiry-page__back" href="/"><ArrowLeft />Back to the journey</a>
    <article>
      <p className="eyebrow"><span />WebNest · Legal</p>
      <h1>{isPrivacy ? 'Privacy policy' : 'Terms of use'}</h1>
      <p className="legal-page__effective">Effective 12 October 2026</p>
      {isPrivacy ? <PrivacyContent /> : <TermsContent />}
    </article>
  </main>
}

function PrivacyContent() {
  return <>
    <section><h2>What we collect</h2><p>When you request an audit or start a project, WebNest may collect your name, email address, business name, website URL, project details, budget, timeline and any information you choose to include.</p></section>
    <section><h2>Why we use it</h2><p>We use enquiry information to review your request, contact you, prepare recommendations or a proposal, prevent abuse and maintain the security of the website. We do not sell personal information or add enquiry contacts to an unrelated mailing list.</p></section>
    <section><h2>Legal basis and consent</h2><p>We process information you submit because you have asked us to take steps toward providing a service. Where consent is required for optional analytics or marketing, it will be requested separately.</p></section>
    <section><h2>Service providers</h2><p>Information may be handled by hosting, email, form-processing, analytics or customer-management providers used to operate WebNest. We limit these providers to the information needed for their role and expect appropriate security safeguards.</p></section>
    <section><h2>Retention</h2><p>Unsuccessful or inactive enquiries are normally deleted or anonymised within 12 months. Information connected to an active client relationship may be retained for the relationship and any legally required record-keeping period.</p></section>
    <section><h2>Your choices</h2><p>You may ask to access, correct or delete your enquiry information, subject to applicable legal obligations. You may also object to or restrict certain processing.</p></section>
    <section><h2>Contact</h2><p>For privacy questions or requests, email <a href="mailto:hello@webnest.in">hello@webnest.in</a>.</p></section>
  </>
}

function TermsContent() {
  return <>
    <section><h2>Using this website</h2><p>You may use this website to learn about WebNest and submit a genuine business enquiry. You must not interfere with the website, attempt unauthorised access, submit unlawful material or misuse its forms.</p></section>
    <section><h2>Information and estimates</h2><p>Website content, package prices and timelines are starting-point information, not a binding proposal. Final scope, fees, deliverables, ownership, support and timing are agreed in a separate written proposal or contract.</p></section>
    <section><h2>Intellectual property</h2><p>Unless stated otherwise, the WebNest name, visual system, copy and original website materials belong to WebNest or are used under licence. Client work shown here remains subject to the rights and permissions applicable to that project.</p></section>
    <section><h2>Third-party services</h2><p>Links or integrations may lead to services operated by others. Their availability, terms and privacy practices are controlled by those providers.</p></section>
    <section><h2>No guarantee</h2><p>We work carefully to keep this website accurate and available, but do not promise uninterrupted operation or a particular business outcome from general information on the site.</p></section>
    <section><h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:hello@webnest.in">hello@webnest.in</a>.</p></section>
  </>
}
