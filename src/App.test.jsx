import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

afterEach(() => {
  window.history.pushState({}, '', '/')
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
  vi.restoreAllMocks()
})

describe('conversion routes', () => {
  it('defaults to morning and restores the night plates when toggled', () => {
    render(<App />)
    expect(document.documentElement).toHaveAttribute('data-theme', 'morning')
    expect(screen.getByRole('img', { name: /sunlit city building.*morning skyline/i })).toHaveAttribute('src', '/assets/optimized/frame2.jpg')

    fireEvent.click(screen.getByRole('button', { name: /switch to night theme/i }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'night')
    expect(screen.getByRole('img', { name: /city building with warm windows at night/i })).toHaveAttribute('src', '/assets/optimized/building-night.jpg')
    expect(screen.getByTestId('live-flame')).toBeInTheDocument()
    expect(window.localStorage.getItem('webnest-theme')).toBe('night')
  })

  it('shows a progress indicator while the opening scene prepares', () => {
    render(<App />)
    expect(screen.getByRole('progressbar', { name: /opening scene/i })).toHaveAttribute('aria-valuenow', '0')
  })

  it('renders the free audit journey at the canonical route', () => {
    window.history.pushState({}, '', '/free-audit')
    render(<App />)
    expect(screen.getByRole('heading', { name: /see what your business needs next/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument()
  })

  it('carries a selected package into the start-project page', () => {
    window.history.pushState({}, '', '/start-project?package=growth&service=automate&industry=clinic')
    render(<App />)
    expect(screen.getByRole('heading', { name: /build the right system around your business/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/starting point/i)).toHaveValue('growth')
    expect(screen.getByLabelText(/primary service/i)).toHaveValue('automate')
    expect(screen.getByLabelText(/^industry/i)).toHaveValue('clinic')
  })

  it('validates and delivers an enquiry through the API', async () => {
    const request = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true, reference: 'WN-P-20261014-A1B2C3D4' }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    window.history.pushState({}, '', '/start-project')
    render(<App />)
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Shaurya' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'shaurya@example.com' } })
    fireEvent.change(screen.getByLabelText(/what are you trying to build/i), { target: { value: 'A connected growth website.' } })
    fireEvent.click(screen.getByRole('button', { name: /send project brief/i }))
    expect(await screen.findByRole('status')).toHaveTextContent(/brief is with webnest/i)
    expect(request).toHaveBeenCalledWith('/api/inquiries', expect.objectContaining({ method: 'POST' }))
    expect(screen.getByRole('status')).toHaveTextContent('WN-P-20261014-A1B2C3D4')
  })

  it('renders approved direct-UPI payments as pending manual verification', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ businessName: 'WebNest', businessEmail: '', whatsAppUrl: null, upiId: null }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    window.history.pushState({}, '', '/payment?reference=WN-2026-001&amount=5000&purpose=Project%20deposit')
    render(<App />)
    expect(screen.getByText('WN-2026-001')).toBeInTheDocument()
    expect(screen.getByText('₹5,000.00')).toBeInTheDocument()
    expect(screen.getByText(/does not itself prove payment/i)).toBeInTheDocument()
  })

  it('keeps the business desk behind an administrator token', () => {
    window.history.pushState({}, '', '/admin')
    render(<App />)
    expect(screen.getByRole('heading', { name: /lead and payment records/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/access token/i)).toHaveAttribute('type', 'password')
  })

  it('renders legal routes and route-specific metadata', async () => {
    window.history.pushState({}, '', '/privacy')
    render(<App />)
    expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe('Privacy policy — WebNest'))
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:3000/privacy')
  })

  it('renders a noindex not-found view for unknown routes', async () => {
    window.history.pushState({}, '', '/missing-page')
    render(<App />)
    expect(screen.getByRole('heading', { name: /this road ends here/i })).toBeInTheDocument()
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'))
  })
})
