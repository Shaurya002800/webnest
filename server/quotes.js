import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
})

const hash = value => createHash('sha256').update(value).digest('hex')
const referencePattern = /^WN-[A-Z0-9-]{4,44}$/

const authorized = (request, env) => {
  const expected = env.ADMIN_ACCESS_TOKEN || ''
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
  if (!expected || !supplied) return false
  return timingSafeEqual(Buffer.from(hash(expected)), Buffer.from(hash(supplied)))
}

const sameOrigin = request => {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}

const getQuote = async (db, reference, token) => {
  if (!referencePattern.test(reference) || !/^[A-Za-z0-9_-]{32,64}$/.test(token)) return null
  const result = await db.prepare('SELECT reference, token_hash, amount_paise, purpose, status FROM payment_quotes WHERE reference = ?1').bind(reference).all()
  const quote = result.results?.[0]
  if (!quote || !timingSafeEqual(Buffer.from(quote.token_hash), Buffer.from(hash(token)))) return null
  return quote
}

export async function handleQuote(request, env, db, path) {
  if (!db) return json({ message: 'Secure quotation storage is unavailable.' }, 503)

  if (path === '/api/admin/quotes' && request.method === 'POST') {
    if (!authorized(request, env)) return json({ message: 'Unauthorized.' }, 401)
    if (!sameOrigin(request)) return json({ message: 'Invalid request origin.' }, 403)
    let body
    try { body = await request.json() } catch { return json({ message: 'Invalid request.' }, 400) }
    const reference = String(body?.reference || '').trim().toUpperCase()
    const purpose = String(body?.purpose || '').trim()
    const amount = Number(body?.amount)
    const amountPaise = Math.round(amount * 100)
    if (!referencePattern.test(reference) || purpose.length < 3 || purpose.length > 120 || !Number.isSafeInteger(amountPaise) || amountPaise < 100 || amountPaise > 1_000_000_000) {
      return json({ message: 'Check the reference, purpose and amount (₹1–₹1 crore).' }, 400)
    }
    const token = randomBytes(32).toString('base64url')
    const now = new Date().toISOString()
    try {
      await db.prepare("INSERT INTO payment_quotes (reference, token_hash, amount_paise, purpose, status, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, 'active', ?5, ?5)")
        .bind(reference, hash(token), amountPaise, purpose, now).run()
    } catch { return json({ message: 'This reference already exists or could not be saved.' }, 409) }
    const link = `${new URL(request.url).origin}/payment?${new URLSearchParams({ reference, token })}`
    return json({ ok: true, reference, amountPaise, purpose, link }, 201)
  }

  if (path.startsWith('/api/quotes/') && request.method === 'GET') {
    const reference = decodeURIComponent(path.slice('/api/quotes/'.length)).toUpperCase()
    const token = new URL(request.url).searchParams.get('token') || ''
    const quote = await getQuote(db, reference, token)
    if (!quote || quote.status !== 'active') return json({ message: 'This quotation link is invalid or no longer active.' }, 404)
    return json({ reference: quote.reference, amountPaise: Number(quote.amount_paise), purpose: quote.purpose, businessName: env.LEGAL_BUSINESS_NAME || 'Web Nest', upiId: env.BUSINESS_UPI_ID || null })
  }

  if (path === '/api/payment-confirmations' && request.method === 'POST') {
    if (!sameOrigin(request)) return json({ message: 'Invalid request origin.' }, 403)
    if (!env.BUSINESS_UPI_ID) return json({ message: 'Business UPI is not configured yet.' }, 503)
    let body
    try { body = await request.json() } catch { return json({ message: 'Invalid request.' }, 400) }
    const fields = body?.fields || {}
    if (typeof fields.website_confirm === 'string' && fields.website_confirm.trim()) return json({ ok: true })
    const reference = String(fields.reference || '').trim().toUpperCase()
    const token = String(fields.token || '')
    const quote = await getQuote(db, reference, token)
    if (!quote || quote.status !== 'active') return json({ message: 'The quotation link is invalid or no longer active.' }, 404)
    const name = String(fields.name || '').trim()
    const email = String(fields.email || '').trim().toLowerCase()
    const utr = String(fields.utr || '').trim().toUpperCase().replace(/\s/g, '')
    if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !/^[A-Z0-9-]{6,50}$/.test(utr)) {
      return json({ message: 'Check your name, email and UPI transaction reference.' }, 400)
    }
    const confirmationId = `WN-PAY-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomBytes(4).toString('hex').toUpperCase()}`
    const now = new Date().toISOString()
    try {
      await db.prepare("INSERT INTO payment_confirmations (id, quote_reference, name, email, amount_paise, utr, status, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7, ?7)")
        .bind(confirmationId, reference, name, email, Number(quote.amount_paise), utr, now).run()
    } catch { return json({ message: 'This bank reference is already recorded or could not be saved.' }, 409) }
    return json({ ok: true, confirmationId, status: 'pending' })
  }

  return json({ message: 'Method not allowed.' }, 405)
}

export async function markQuotePaid(request, env, db, path) {
  if (!authorized(request, env) || request.method !== 'PATCH' || !/^\/api\/admin\/records\/payment\//.test(path)) return
  const copy = request.clone()
  let body
  try { body = await copy.json() } catch { return }
  if (body?.status !== 'verified') return
  const id = decodeURIComponent(path.split('/').at(-1))
  const result = await db.prepare('SELECT quote_reference FROM payment_confirmations WHERE id = ?1').bind(id).all()
  const reference = result.results?.[0]?.quote_reference
  if (reference) await db.prepare("UPDATE payment_quotes SET status = 'paid', updated_at = ?1 WHERE reference = ?2").bind(new Date().toISOString(), reference).run()
}
