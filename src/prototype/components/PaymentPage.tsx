import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, CopySimple, ShieldCheck } from '@phosphor-icons/react'
import { QRCodeSVG } from 'qrcode.react'

type PublicConfig = { businessName: string; businessEmail: string; whatsAppUrl: string | null; upiId: string | null }

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })

export function PaymentPage() {
  const [config, setConfig] = useState<PublicConfig | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const reference = (params.get('reference') || '').toUpperCase().slice(0, 48)
  const amount = Number(params.get('amount') || 0)
  const purpose = (params.get('purpose') || 'Approved WebNest project deposit').slice(0, 120)
  const ready = /^WN-[A-Z0-9-]{4,44}$/.test(reference) && Number.isFinite(amount) && amount > 0

  useEffect(() => {
    fetch('/api/business-config').then(response => response.json()).then(setConfig).catch(() => setConfig({ businessName: 'WebNest', businessEmail: '', whatsAppUrl: null, upiId: null }))
  }, [])

  const upiUrl = config?.upiId && ready ? `upi://pay?${new URLSearchParams({ pa: config.upiId, pn: config.businessName, am: amount.toFixed(2), cu: 'INR', tn: `${reference} ${purpose}`.slice(0, 80), tr: reference })}` : ''

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      const response = await fetch('/api/payment-confirmations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'We could not record the payment reference.')
      setMessage(result.confirmationId)
      setStatus('success')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not record the payment reference.')
      setStatus('error')
    }
  }

  return <main className="business-flow-page payment-page">
    <a className="business-flow-page__back" href="/"><ArrowLeft /> Back to WebNest</a>
    <section className="payment-page__intro">
      <p className="eyebrow"><span />Approved quotation payment</p>
      <h1>Pay clearly.<br /><em>Verify safely.</em></h1>
      <p>This page is used only after WebNest sends a written quotation. Direct UPI keeps the payment simple; the bank credit is checked before your payment is marked verified.</p>
      <div className="payment-page__trust"><ShieldCheck /> No card details are collected or stored by this website.</div>
    </section>
    <section className="payment-card" aria-label="UPI payment details">
      {!ready ? <div className="payment-card__empty"><h2>Use the link in your quotation.</h2><p>A valid WebNest payment link includes your quotation reference and approved amount. Please ask WebNest to resend it.</p>{config?.whatsAppUrl ? <a className="button button--primary" href={config.whatsAppUrl}>Contact on WhatsApp <ArrowRight /></a> : null}</div> : <>
        <div className="payment-card__summary"><span>Quotation</span><strong>{reference}</strong><span>Purpose</span><strong>{purpose}</strong><span>Amount</span><strong>{money.format(amount)}</strong></div>
        {config?.upiId ? <div className="payment-card__pay"><QRCodeSVG value={upiUrl} size={190} bgColor="#fffaf2" fgColor="#121817" level="M" marginSize={2} /><div><p>Scan with any UPI app or open it on this device.</p><a className="button button--primary" href={upiUrl}>Open UPI app <ArrowRight /></a><button type="button" className="text-action" onClick={() => navigator.clipboard.writeText(config.upiId || '')}><CopySimple /> Copy UPI ID</button><small>Payee: {config.businessName}<br />UPI ID: {config.upiId}</small></div></div> : <p className="business-flow-page__notice">The business UPI ID will appear here after final configuration. No payment can be requested until it is added.</p>}
        {status === 'success' ? <div className="payment-card__success" role="status"><CheckCircle /><h2>Reference received.</h2><p>Confirmation <strong>{message}</strong> is pending bank verification. WebNest will send a receipt after the credit is confirmed.</p>{config?.whatsAppUrl ? <a href={`${config.whatsAppUrl}${config.whatsAppUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(`Hello WebNest, I submitted payment confirmation ${message} for ${reference}.`)}`}>Continue on WhatsApp <ArrowRight /></a> : null}</div> : <form className="payment-confirmation" onSubmit={submit}>
          <h2>Already paid?</h2><p>Enter the bank reference so WebNest can match the credit. A screenshot alone is not treated as verification.</p>
          <input type="hidden" name="reference" value={reference} /><input type="hidden" name="amount" value={amount.toFixed(2)} />
          <label className="inquiry-page__honeypot" aria-hidden="true">Leave empty<input name="website_confirm" tabIndex={-1} /></label>
          <div className="inquiry-page__field-row"><label>Name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" required type="email" autoComplete="email" /></label></div>
          <label>UPI transaction reference / UTR<input name="utr" required inputMode="numeric" minLength={6} maxLength={50} placeholder="Enter the reference shown by your bank" /></label>
          {status === 'error' ? <p className="inquiry-page__error" role="alert">{message}</p> : null}
          <button className="button button--primary" disabled={status === 'submitting'}>{status === 'submitting' ? 'Recording…' : 'Submit for verification'} <ArrowRight /></button>
          <small>Submitting this form does not itself prove payment. WebNest will verify the matching bank credit.</small>
        </form>}
      </>}
    </section>
  </main>
}
