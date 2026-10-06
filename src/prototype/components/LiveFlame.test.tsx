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

  it('draws a still flame when reduced motion is requested', () => {
    const gradient = { addColorStop: vi.fn() }
    const context = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      createRadialGradient: vi.fn(() => gradient),
      createLinearGradient: vi.fn(() => gradient),
      setTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      ellipse: vi.fn(),
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)

    render(<LiveFlame reducedMotion />)

    expect(context.fill).toHaveBeenCalledTimes(4)
    expect(context.ellipse).toHaveBeenCalledWith(60, 145, 6, 8, 0, 0, Math.PI * 2)
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
