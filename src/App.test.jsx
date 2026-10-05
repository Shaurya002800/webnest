import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'

afterEach(() => window.history.pushState({}, '', '/'))

describe('conversion routes', () => {
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
    window.history.pushState({}, '', '/start-project?package=growth')
    render(<App />)
    expect(screen.getByRole('heading', { name: /build the right system around your business/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/starting point/i)).toHaveValue('growth')
  })

  it('validates and completes an enquiry in the prototype', () => {
    window.history.pushState({}, '', '/start-project')
    render(<App />)
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Shaurya' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'shaurya@example.com' } })
    fireEvent.change(screen.getByLabelText(/what are you trying to build/i), { target: { value: 'A connected growth website.' } })
    fireEvent.click(screen.getByRole('button', { name: /send project brief/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/brief is ready/i)
  })
})
