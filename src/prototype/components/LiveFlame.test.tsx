import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiveFlame } from './LiveFlame'

describe('LiveFlame', () => {
  it('renders a live canvas anchored as decorative light', () => {
    render(<LiveFlame reducedMotion />)
    const flame = screen.getByTestId('live-flame')
    expect(flame).toHaveAttribute('aria-hidden', 'true')
    expect(flame).toHaveAttribute('data-reduced-motion', 'true')
    expect(flame.querySelector('canvas')).toBeInTheDocument()
  })
})

