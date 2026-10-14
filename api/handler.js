import worker from '../worker/index.js'
import { createNeonDatabase } from '../server/neon-db.js'
import { handleQuote, markQuotePaid } from '../server/quotes.js'

let database

const allowedRoute = path => path === '/api/inquiries'
  || path === '/api/payment-confirmations'
  || path === '/api/admin/quotes'
  || /^\/api\/quotes\/WN-[A-Z0-9-]{4,44}$/.test(path)
  || path === '/api/business-config'
  || path === '/api/events'
  || path === '/api/admin/records'
  || /^\/api\/admin\/records\/(lead|payment)\/[^/]+$/.test(path)

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const route = url.searchParams.get('route')
    const path = route ? `/api/${route.replace(/^\/+/, '')}` : url.pathname
    if (!allowedRoute(path)) return Response.json({ message: 'Not found.' }, { status: 404 })
    url.pathname = path
    url.searchParams.delete('route')
    const routedRequest = new Request(url, request)
    const env = { ...process.env }
    if (env.DATABASE_URL) {
      database ||= createNeonDatabase(env.DATABASE_URL)
      env.DB = database
    }
    if (path === '/api/admin/quotes' || path.startsWith('/api/quotes/') || path === '/api/payment-confirmations') {
      try { return await handleQuote(routedRequest, env, env.DB, path) }
      catch { return Response.json({ message: 'The payment service is temporarily unavailable.' }, { status: 503 }) }
    }
    if (path === '/api/business-config') delete env.BUSINESS_UPI_ID
    try {
      const recordUpdate = path.startsWith('/api/admin/records/payment/') && request.method === 'PATCH' ? routedRequest.clone() : null
      const response = await worker.fetch(routedRequest, env)
      if (recordUpdate && response.ok) await markQuotePaid(recordUpdate, env, env.DB, path)
      return response
    } catch {
      return Response.json({ message: 'The service is temporarily unavailable.' }, { status: 503 })
    }
  },
}
