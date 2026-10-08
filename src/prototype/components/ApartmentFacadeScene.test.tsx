import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ApartmentFacadeScene } from './ApartmentFacadeScene'

describe('interactive apartment façade scene', () => {
  it('uses the morning façade still without creating a WebGL surface', () => {
    const { container } = render(<ApartmentFacadeScene reducedMotion={false} />)
    expect(screen.getByRole('region', { name: /more than a website agency/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /cinematic apartment façade in morning light/i })).toHaveAttribute('src', '/assets/reference/apartment-facade-morning.jpg')
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /more than a website agency/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(screen.getByRole('link', { name: /see how webnest works/i })).toHaveAttribute('href', '#process')
  })

  it('lets a visitor focus a principle room without scrolling', () => {
    render(<ApartmentFacadeScene reducedMotion={false} />)
    const principle = screen.getByRole('button', { name: /03 built around you/i })
    fireEvent.click(principle)
    expect(principle).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/no fixed template/i)).toBeVisible()
  })

  it('illuminates only the matching window while its principle text is hovered', () => {
    render(<ApartmentFacadeScene reducedMotion={false} />)
    const scene = screen.getByTestId('apartment-facade')
    const principle = screen.getByRole('button', { name: /02 everything connected/i })

    fireEvent.pointerEnter(principle)
    expect(scene).toHaveAttribute('data-illuminated-window', '1')
    expect(principle).toHaveAttribute('data-window-active', 'true')

    fireEvent.pointerLeave(principle)
    expect(scene).not.toHaveAttribute('data-illuminated-window')
    expect(principle).toHaveAttribute('data-window-active', 'false')
  })
})
