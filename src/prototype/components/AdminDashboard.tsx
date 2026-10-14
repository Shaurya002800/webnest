import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CopySimple, LockKey, SignOut } from '@phosphor-icons/react'

type Lead = { id: string; kind: string; name: string; email: string; phone?: string; company?: string; contact_preference: string; status: string; created_at: string; fields_json: string }
type Payment = { id: string; quote_reference: string; name: string; email: string; amount_paise: number; utr: string; status: string; created_at: string }
type Records = { leads: Lead[]; payments: Payment[] }

const leadStatuses = ['new', 'contacted', 'quoted', 'accepted', 'completed', 'closed']
const paymentStatuses = ['pending', 'verified', 'rejected']

export function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem('webnest-admin-token') || '')
  const [records, setRecords] = useState<Records | null>(null)
  const [error, setError] = useState('')
  const [link, setLink] = useState('')

  const load = async (accessToken = token) => {
    setError('')
    const response = await fetch('/api/admin/records', { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!response.ok) throw new Error(response.status === 401 ? 'That access token was not accepted.' : 'The business desk is unavailable.')
    sessionStorage.setItem('webnest-admin-token', accessToken)
    setRecords(await response.json())
  }

  useEffect(() => { if (token) load(token).catch(reason => setError(reason.message)) }, [])

  const login = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); load(token).catch(reason => setError(reason.message)) }
  const update = async (kind: 'lead' | 'payment', id: string, status: string) => {
    const response = await fetch(`/api/admin/records/${kind}/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    if (!response.ok) return setError('The status could not be updated.')
    await load()
  }
  const buildLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const query = new URLSearchParams({ reference: String(values.get('reference') || '').toUpperCase(), amount: String(values.get('amount') || ''), purpose: String(values.get('purpose') || '') })
    setLink(`${window.location.origin}/payment?${query}`)
  }
  const count = useMemo(() => ({ leads: records?.leads.length || 0, pending: records?.payments.filter(item => item.status === 'pending').length || 0 }), [records])

  if (!records) return <main className="admin-page"><a href="/" className="business-flow-page__back"><ArrowLeft /> Back to WebNest</a><form className="admin-login" onSubmit={login}><LockKey /><p className="eyebrow"><span />Protected business desk</p><h1>Lead and payment records.</h1><p>Enter the administrator token configured for this Site. It stays in this browser tab only.</p><label>Access token<input type="password" value={token} onChange={event => setToken(event.target.value)} required autoComplete="current-password" /></label>{error ? <p className="inquiry-page__error">{error}</p> : null}<button className="button button--primary">Open business desk <ArrowRight /></button></form></main>

  return <main className="admin-page admin-page--dashboard"><header><div><p className="eyebrow"><span />WebNest business desk</p><h1>{count.leads} leads · {count.pending} pending payments</h1></div><button className="text-action" onClick={() => { sessionStorage.removeItem('webnest-admin-token'); setRecords(null); setToken('') }}><SignOut /> Sign out</button></header>
    <section className="admin-link-builder"><h2>Create an approved payment link</h2><form onSubmit={buildLink}><label>Quotation reference<input name="reference" required pattern="WN-[A-Za-z0-9-]{4,44}" placeholder="WN-2026-001" /></label><label>Amount (₹)<input name="amount" required type="number" min="1" step="0.01" /></label><label>Purpose<input name="purpose" required placeholder="50% project deposit" /></label><button className="button button--primary">Create link</button></form>{link ? <div className="admin-link-builder__result"><code>{link}</code><button className="text-action" onClick={() => navigator.clipboard.writeText(link)}><CopySimple /> Copy</button></div> : null}</section>
    <section className="admin-records"><h2>Enquiries</h2>{records.leads.map(item => <article key={item.id}><div><strong>{item.id}</strong><span>{new Date(item.created_at).toLocaleString('en-IN')}</span></div><h3>{item.name} · {item.kind}</h3><p>{item.email}{item.phone ? ` · ${item.phone}` : ''}{item.company ? ` · ${item.company}` : ''}</p><details><summary>Submitted details</summary><pre>{JSON.stringify(JSON.parse(item.fields_json), null, 2)}</pre></details><select aria-label={`Status for ${item.id}`} value={item.status} onChange={event => update('lead', item.id, event.target.value)}>{leadStatuses.map(status => <option key={status}>{status}</option>)}</select></article>)}</section>
    <section className="admin-records"><h2>Payment confirmations</h2>{records.payments.map(item => <article key={item.id}><div><strong>{item.quote_reference}</strong><span>{new Date(item.created_at).toLocaleString('en-IN')}</span></div><h3>{item.name} · ₹{(item.amount_paise / 100).toLocaleString('en-IN')}</h3><p>{item.email} · UTR {item.utr} · Confirmation {item.id}</p><select aria-label={`Status for ${item.id}`} value={item.status} onChange={event => update('payment', item.id, event.target.value)}>{paymentStatuses.map(status => <option key={status}>{status}</option>)}</select></article>)}</section>
  </main>
}
