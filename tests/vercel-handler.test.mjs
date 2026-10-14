import assert from 'node:assert/strict'
import test from 'node:test'
import handler from '../api/handler.js'

test('routes public business configuration without exposing payment details', async () => {
  const response = await handler.fetch(new Request('https://webnest.example/api/handler?route=business-config'))
  assert.equal(response.status, 200)
  const config = await response.json()
  assert.equal(config.upiId, null)
})

test('keeps unverified payment links closed on Vercel', async () => {
  const response = await handler.fetch(new Request('https://webnest.example/api/handler?route=payment-confirmations', { method: 'POST' }))
  assert.equal(response.status, 503)
})

test('rejects unrecognized function routes', async () => {
  const response = await handler.fetch(new Request('https://webnest.example/api/handler?route=missing'))
  assert.equal(response.status, 404)
})
