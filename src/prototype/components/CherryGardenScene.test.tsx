import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CherryGardenScene } from './CherryGardenScene'

describe('cherry blossom business-journey scene', () => {
  it('uses the morning plate and a dedicated slow petal film instead of another WebGL renderer', () => {
    const { container } = render(<CherryGardenScene reducedMotion={false} />)
    expect(screen.getByRole('region', { name: /different businesses/i })).toBeInTheDocument()
    expect(container.querySelector<HTMLImageElement>('.cherry-garden__plate')).toHaveAttribute('src', '/assets/reference/cherry-garden-morning.webp')
    const film = container.querySelector<HTMLVideoElement>('video[autoplay][loop][playsinline]')
    expect(film).toBeInTheDocument()
    expect(film?.muted).toBe(true)
    expect(film).toHaveAttribute('data-motion', 'slow-petals')
    expect(film).not.toHaveAttribute('poster')
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /different businesses.*one webnest/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(6)
    expect(screen.getByRole('link', { name: /explore business solutions/i })).toHaveAttribute('href', '#industries')
  })

  it('lets a visitor inspect a business journey without scrolling', () => {
    render(<CherryGardenScene reducedMotion={false} />)
    const clinics = screen.getByRole('button', { name: /03 clinics/i })
    fireEvent.click(clinics)
    expect(clinics).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Patient Enquiries')).toBeVisible()
    expect(screen.getByText('Follow-ups')).toBeVisible()
  })
})
