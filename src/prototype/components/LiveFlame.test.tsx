import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LiveFlame } from './LiveFlame'

describe('LiveFlame', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('renders a live canvas anchored as decorative light', () => {
    render(<LiveFlame reducedMotion />)
    const flame = screen.getByTestId('live-flame')
    expect(flame).toHaveAttribute('aria-hidden', 'true')
    expect(flame).toHaveAttribute('data-reduced-motion', 'true')
    expect(flame.querySelector('canvas')).toBeInTheDocument()
  })

  it('pauses its animation whenever the hero is outside the viewport', () => {
    let callback: (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void = () => {}
    vi.stubGlobal('IntersectionObserver', class {
      constructor(next: typeof callback) { callback = next }
      observe() {}
      disconnect() {}
    })

    render(<LiveFlame />)
    const flame = screen.getByTestId('live-flame')
    expect(flame).toHaveAttribute('data-animating', 'false')
    act(() => callback([{ isIntersecting: true }]))
    expect(flame).toHaveAttribute('data-animating', 'true')
    act(() => callback([{ isIntersecting: false }]))
    expect(flame).toHaveAttribute('data-animating', 'false')
  })
})
