import { useEffect, useRef, useState } from 'react'

type LiveFlameProps = { reducedMotion?: boolean }

function drawFlame(context: CanvasRenderingContext2D, time: number) {
  context.clearRect(0, 0, 120, 180)
  const sway = Math.sin(time / 530) * 2.3 + Math.sin(time / 197) * .8
  const breath = Math.sin(time / 280) * 2 + Math.sin(time / 83) * .7
  const tip = 60 + sway * 1.25
  const base = 146

  const glow = context.createRadialGradient(60, 127, 1, 60, 117, 43)
  glow.addColorStop(0, 'rgba(255,192,102,.34)')
  glow.addColorStop(.36, 'rgba(255,125,43,.14)')
  glow.addColorStop(1, 'rgba(255,100,20,0)')
  context.fillStyle = glow
  context.fillRect(15, 65, 90, 100)

  // One asymmetrical, translucent body; light is layered inside it rather than
  // outlined as three solid nested silhouettes.
  const traceFlame = () => {
    context.beginPath()
    context.moveTo(60, base)
    context.bezierCurveTo(54, 139, 49 + sway * .2, 128, 49 + sway * .35, 113)
    context.bezierCurveTo(48 + sway * .55, 95, 55 + sway * .6, 81, tip, 69 + breath)
    context.bezierCurveTo(61 + sway * .7, 86, 72 + sway * .3, 97, 71 + sway * .25, 115)
    context.bezierCurveTo(70, 131, 65, 142, 60, base)
    context.closePath()
  }

  context.save()
  context.shadowColor = 'rgba(255,119,36,.62)'
  context.shadowBlur = 18
  const amber = context.createLinearGradient(48, 78, 72, 143)
  amber.addColorStop(0, 'rgba(255,138,42,.04)')
  amber.addColorStop(.32, 'rgba(255,148,45,.36)')
  amber.addColorStop(.72, 'rgba(255,176,68,.65)')
  amber.addColorStop(1, 'rgba(255,207,105,.76)')
  context.fillStyle = amber
  traceFlame()
  context.fill()
  context.restore()

  context.save()
  traceFlame()
  context.clip()
  const warmth = context.createRadialGradient(60 + sway * .25, 128, 1, 60 + sway * .25, 121, 25)
  warmth.addColorStop(0, 'rgba(255,247,189,.9)')
  warmth.addColorStop(.35, 'rgba(255,206,105,.6)')
  warmth.addColorStop(1, 'rgba(255,152,46,0)')
  context.fillStyle = warmth
  context.fillRect(44, 83, 34, 65)
  context.restore()

  const core = context.createRadialGradient(60, 140, 0, 60, 134, 11)
  core.addColorStop(0, 'rgba(255,255,228,.94)')
  core.addColorStop(.55, 'rgba(255,240,182,.45)')
  core.addColorStop(1, 'rgba(255,217,133,0)')
  context.fillStyle = core
  context.fillRect(49, 122, 22, 25)

  const wick = context.createLinearGradient(60, 145, 60, 153)
  wick.addColorStop(0, 'rgba(57,39,34,.9)')
  wick.addColorStop(1, 'rgba(20,16,17,0)')
  context.fillStyle = wick
  context.fillRect(59, 145, 2, 8)
}

export function LiveFlame({ reducedMotion = false }: LiveFlameProps) {
  const shellRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const shell = shellRef.current
    if (!shell || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '20%' })
    observer.observe(shell)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return

    let context: CanvasRenderingContext2D | null = null
    try { context = canvas.getContext('2d') } catch { return }
    if (!context) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = 120 * dpr
    canvas.height = 180 * dpr
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    let animation = 0

    const draw = (time: number) => {
      drawFlame(context!, time)
      if (!reducedMotion) animation = requestAnimationFrame(draw)
    }
    if (reducedMotion) {
      draw(0)
      return
    }
    animation = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animation)
  }, [reducedMotion, visible])

  return (
    <span ref={shellRef} className="live-flame" data-testid="live-flame" data-reduced-motion={String(reducedMotion)} data-animating={String(!reducedMotion && visible)} aria-hidden="true">
      <canvas ref={canvasRef} width="120" height="180" />
    </span>
  )
}
