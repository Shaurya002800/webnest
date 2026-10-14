import assert from 'node:assert/strict'
import test from 'node:test'
import { handleQuote } from '../server/quotes.js'

const fakeDb = () => {
  const quotes = new Map()
  const confirmations = []
  const prepare = sql => ({ bind(...values) { return {
    async run() {
      if (sql.startsWith('INSERT INTO payment_quotes')) {
        if (quotes.has(values[0])) throw new Error('duplicate')
        quotes.set(values[0], { reference: values[0], token_hash: values[1], amount_paise: values[2], purpose: values[3], status: 'active' })
      }
      if (sql.startsWith('INSERT INTO payment_confirmations')) confirmations.push(values)
      return { success: true }
    },
    async all() {
      if (sql.includes('FROM payment_quotes')) return { results: [quotes.get(values[0])].filter(Boolean) }
      return { results: [] }
    },
  } } })
  return { prepare, quotes, confirmations }
}

const env = { ADMIN_ACCESS_TOKEN: 'private-admin-secret', LEGAL_BUSINESS_NAME: 'Web Nest', BUSINESS_UPI_ID: 'test@upi' }

test('only an authorized admin can issue a server-stored quotation', async () => {
  const db = fakeDb()
  const payload = { reference: 'WN-2026-001', amount: '5000', purpose: 'Project deposit' }
  const unauthenticated = await handleQuote(new Request('https://webnest.example/api/admin/quotes', { method: 'POST', body: JSON.stringify(payload) }), env, db, '/api/admin/quotes')
  assert.equal(unauthenticated.status, 401)
  const created = await handleQuote(new Request('https://webnest.example/api/admin/quotes', { method: 'POST', headers: { authorization: `Bearer ${env.ADMIN_ACCESS_TOKEN}` }, body: JSON.stringify(payload) }), env, db, '/api/admin/quotes')
  assert.equal(created.status, 201)
  const { link } = await created.json()
  assert.match(link, /^https:\/\/webnest\.example\/payment\?reference=WN-2026-001&token=/)
  assert.equal(db.quotes.get('WN-2026-001').amount_paise, 500000)
  assert.equal(link.includes('amount='), false)
})

test('rejects a changed token and records the approved amount, not a browser amount', async () => {
  const db = fakeDb()
  const created = await handleQuote(new Request('https://webnest.example/api/admin/quotes', { method: 'POST', headers: { authorization: `Bearer ${env.ADMIN_ACCESS_TOKEN}` }, body: JSON.stringify({ reference: 'WN-2026-002', amount: '5000', purpose: 'Project deposit' }) }), env, db, '/api/admin/quotes')
  const { link } = await created.json()
  const token = new URL(link).searchParams.get('token')
  const bad = await handleQuote(new Request(`https://webnest.example/api/quotes/WN-2026-002?token=${'x'.repeat(43)}`), env, db, '/api/quotes/WN-2026-002')
  assert.equal(bad.status, 404)
  const valid = await handleQuote(new Request(`https://webnest.example/api/quotes/WN-2026-002?token=${token}`), env, db, '/api/quotes/WN-2026-002')
  assert.equal((await valid.json()).amountPaise, 500000)
  const confirmation = await handleQuote(new Request('https://webnest.example/api/payment-confirmations', { method: 'POST', body: JSON.stringify({ fields: { reference: 'WN-2026-002', token, amount: '1', name: 'Test Customer', email: 'test@example.com', utr: '123456789012' } }) }), env, db, '/api/payment-confirmations')
  assert.equal(confirmation.status, 200)
  assert.equal(db.confirmations[0][4], 500000)
})
