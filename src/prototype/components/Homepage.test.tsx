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
    const question = screen.getByRole('button', { name: /how much does a project cost/i })
    fireEvent.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/projects depend on scope/i)).toBeVisible()
  })

  it('uses a morning exterior building plate by default', () => {
    render(<Homepage />)
    expect(screen.getByTestId('hero-exterior-journey')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /sunlit city building in the morning/i })).toHaveAttribute('src', '/assets/generated/building-morning.webp')
  })

  it('uses one continuous morning hero journey instead of repeating the room in a second section', () => {
    render(<Homepage />)
    const journey = screen.getByTestId('hero-exterior-journey')
    expect(journey).toContainElement(screen.getByRole('heading', { level: 1, name: /where brands/i }))
    expect(journey).toContainElement(screen.getByRole('img', { name: /sunlit city building in the morning/i }))
    expect(journey.querySelectorAll('img[src="/assets/generated/hero-room-morning.png"]')).toHaveLength(1)
    expect(journey.querySelector('.exterior-flame-camera')).not.toBeInTheDocument()
    expect(screen.queryByTestId('live-flame')).not.toBeInTheDocument()
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
    expect(screen.getByRole('img', { name: /cinematic apartment façade in morning light/i })).toHaveAttribute('src', '/assets/reference/apartment-facade-morning.webp')
    expect(apartment.querySelector('canvas')).not.toBeInTheDocument()
    expect(cherry.compareDocumentPosition(apartment) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.querySelector('.window-grid')).not.toBeInTheDocument()
  })

  it('continues from the apartment into every cinematic late-journey frame in order', () => {
    render(<Homepage />)
    const apartment = screen.getByTestId('apartment-facade')
    const selectedWork = screen.getByTestId('selected-work-scene')
    const process = screen.getByTestId('process-scene')
    const pricing = screen.getByTestId('pricing-scene')
    const audit = screen.getByTestId('audit-scene')
    const faq = screen.getByTestId('faq-scene')
    const finalCta = screen.getByTestId('final-cta-scene')

    expect(screen.getByRole('heading', { name: /built to solve real business problems/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /from business problem to growth system/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /start with what your business actually needs/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /not sure what your business needs/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /before you work with webnest/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /your next customer may already be looking for you/i })).toBeInTheDocument()

    const sequence = [selectedWork, process, pricing, audit, faq, finalCta]
    expect(apartment.compareDocumentPosition(sequence[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    sequence.slice(0, -1).forEach((scene, index) => {
      expect(scene.compareDocumentPosition(sequence[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  it('lets visitors actively explore project and process details', () => {
    render(<Homepage />)
    const selectedWork = screen.getByTestId('selected-work-scene')
    const modelArena = screen.getByRole('button', { name: /modelarena/i })
    fireEvent.pointerEnter(modelArena)
    expect(modelArena).toHaveAttribute('aria-pressed', 'true')
    expect(selectedWork).toHaveAttribute('data-active-project', '2')

    const grow = screen.getByRole('button', { name: /05 grow/i })
    fireEvent.click(grow)
    expect(grow).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('process-scene')).toHaveAttribute('data-active-step', '4')
  })

  it('keeps pricing, audit, FAQ and final conversion actions functional', () => {
    render(<Homepage />)
    expect(screen.getByRole('link', { name: /^choose growth$/i })).toHaveAttribute('href', '/start-project?package=growth')
    expect(screen.getAllByRole('link', { name: /get my free audit/i }).every((link) => link.getAttribute('href') === '/free-audit')).toBe(true)

    const question = screen.getByRole('button', { name: /can you connect whatsapp/i })
    fireEvent.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/lead workflows, reminders, crm and automation/i)).toBeVisible()
  })
})
