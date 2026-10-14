import worker from '../worker/index.js'
import { createNeonDatabase } from '../server/neon-db.js'

let database

const allowedRoute = path => path === '/api/inquiries'
  || path === '/api/payment-confirmations'
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
    // An unsigned URL amount is not an approved quote. Keep the Vercel
    // payment endpoint and payee details closed until server-side quotes exist.
    if (path === '/api/payment-confirmations') return Response.json({ message: 'Payment verification is being configured.' }, { status: 503 })
    if (path === '/api/business-config') delete env.BUSINESS_UPI_ID
    try {
      return await worker.fetch(routedRequest, env)
    } catch {
      return Response.json({ message: 'The service is temporarily unavailable.' }, { status: 503 })
    }
  },
}
