import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { axe, toHaveNoViolations } from 'jest-axe'
import { App } from './App'

expect.extend(toHaveNoViolations)

afterEach(() => {
  window.history.pushState({}, '', '/')
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe.each(['/', '/free-audit', '/start-project', '/privacy', '/terms', '/admin', '/payment?reference=WN-2026-001&amount=5000', '/missing-page'])('accessibility at %s', (path) => {
  it('has no detectable structural accessibility violations', async () => {
    window.history.pushState({}, '', path)
    const { container } = render(<App />)
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results).toHaveNoViolations()
  })
})
