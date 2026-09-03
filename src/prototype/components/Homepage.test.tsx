import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Homepage } from './Homepage'

describe('homepage conversion and FAQ', () => {
  it('uses the canonical hero actions', () => {
    render(<Homepage />)
    expect(screen.getAllByRole('link', { name: /get a free audit/i }).every((link) => link.getAttribute('href') === '/free-audit')).toBe(true)
    expect(screen.getAllByRole('link', { name: /start a project/i }).every((link) => link.getAttribute('href') === '/start-project')).toBe(true)
  })

  it('opens an FAQ answer', () => {
    render(<Homepage />)
    const question = screen.getByRole('button', { name: /how long does a project take/i })
    fireEvent.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/most focused builds launch in/i)).toBeVisible()
  })

  it('uses a real exterior building plate for the second frame', () => {
    render(<Homepage />)
    expect(screen.getByTestId('hero-exterior-journey')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /night building outside the studio window/i })).toHaveAttribute('src', '/assets/generated/building-night.png')
  })

  it('uses one continuous hero journey instead of repeating the room in a second section', () => {
    render(<Homepage />)
    const journey = screen.getByTestId('hero-exterior-journey')
    expect(journey).toContainElement(screen.getByRole('heading', { level: 1, name: /where brands/i }))
    expect(journey).toContainElement(screen.getByRole('img', { name: /night building outside the studio window/i }))
    expect(journey.querySelectorAll('img[src="/assets/generated/hero-room-clean.png"]')).toHaveLength(1)
  })

  it('continues from the exterior into the interactive street system', () => {
    render(<Homepage />)
    expect(screen.getByTestId('street-system')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /connected online business system/i })).toBeInTheDocument()
    expect(document.querySelector('.system-line')).not.toBeInTheDocument()
  })

  it('continues from the street into the real-time coffee shop scene', async () => {
    render(<Homepage />)
    expect(screen.getByTestId('coffee-shop')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /everything your business needs/i })).toBeInTheDocument()
    expect(await screen.findByRole('img', { name: /royal 3d coffee shop interior/i })).toBeInTheDocument()
  })

  it('continues through the cafe rear door into the lightweight cherry garden', () => {
    const { container } = render(<Homepage />)
    const coffee = screen.getByTestId('coffee-shop')
    const cherry = screen.getByTestId('cherry-garden')
    expect(screen.getByRole('region', { name: /different businesses/i })).toBeInTheDocument()
    const film = cherry.querySelector<HTMLVideoElement>('video[autoplay][loop][playsinline]')
    expect(film).toBeInTheDocument()
    expect(film?.muted).toBe(true)
    expect(cherry.querySelector('canvas')).not.toBeInTheDocument()
    expect(container.querySelectorAll('video[autoplay][loop]')).toHaveLength(1)
    expect(coffee.compareDocumentPosition(cherry) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('continues from the cherry branches into the supplied apartment façade still', () => {
    const { container } = render(<Homepage />)
    const cherry = screen.getByTestId('cherry-garden')
    const apartment = screen.getByTestId('apartment-facade')
    expect(screen.getByRole('region', { name: /more than a website agency/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /cinematic apartment façade at night/i })).toHaveAttribute('src', '/assets/reference/apartment-facade-royal.webp')
    expect(apartment.querySelector('canvas')).not.toBeInTheDocument()
    expect(cherry.compareDocumentPosition(apartment) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.querySelector('.window-grid')).not.toBeInTheDocument()
  })
})
