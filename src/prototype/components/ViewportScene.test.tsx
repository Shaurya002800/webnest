import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ViewportScene } from './ViewportScene'

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void

describe('ViewportScene', () => {
  let callback: ObserverCallback
  let rootMargin = ''
  const disconnect = vi.fn()

  beforeEach(() => {
    disconnect.mockClear()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(next: ObserverCallback, options?: IntersectionObserverInit) {
        callback = next
        rootMargin = options?.rootMargin ?? ''
      }
      observe() {}
      disconnect() { disconnect() }
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('keeps an expensive scene unmounted until it is near the viewport', () => {
    render(<ViewportScene label="city"><canvas data-testid="expensive-scene" /></ViewportScene>)
    expect(screen.queryByTestId('expensive-scene')).not.toBeInTheDocument()
    expect(rootMargin).toBe('20% 0px')

    act(() => callback([{ isIntersecting: true }]))
    expect(screen.getByTestId('expensive-scene')).toBeInTheDocument()
  })

  it('releases the expensive scene after it leaves the preload area', () => {
    render(<ViewportScene label="city"><canvas data-testid="expensive-scene" /></ViewportScene>)
    act(() => callback([{ isIntersecting: true }]))
    act(() => callback([{ isIntersecting: false }]))

    expect(screen.queryByTestId('expensive-scene')).not.toBeInTheDocument()
    expect(disconnect).not.toHaveBeenCalled()
  })
})
