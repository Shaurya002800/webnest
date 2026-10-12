import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackAnalytics } from './analytics'

afterEach(() => {
  document.querySelector('meta[name="webnest-analytics"]')?.remove()
  vi.restoreAllMocks()
})

describe('privacy-conscious analytics', () => {
  it('emits an integration event without making a request when analytics is disabled', () => {
    const listener = vi.fn()
    window.addEventListener('webnest:analytics', listener)
    trackAnalytics('page_view')
    expect(listener).toHaveBeenCalledOnce()
    window.removeEventListener('webnest:analytics', listener)
  })

  it('sends only named event properties when a server endpoint enables analytics', () => {
    const meta = document.createElement('meta')
    meta.name = 'webnest-analytics'
    meta.content = '/api/events'
    document.head.appendChild(meta)
    const request = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    trackAnalytics('project_cta_clicked', { package: 'growth' })
    expect(request).toHaveBeenCalledWith('/api/events', expect.objectContaining({ method: 'POST', keepalive: true }))
    expect(request.mock.calls[0][1]?.body).toContain('project_cta_clicked')
    expect(request.mock.calls[0][1]?.body).not.toContain('email')
  })
})
