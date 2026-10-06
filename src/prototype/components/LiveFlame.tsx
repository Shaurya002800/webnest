import { useEffect, useRef, useState } from 'react'

type LiveFlameProps = { reducedMotion?: boolean }

function drawFlame(context: CanvasRenderingContext2D, time: number) {
  context.clearRect(0, 0, 120, 180)
  context.save()
  context.translate(0, 174)
  context.scale(1, 1.3)
  context.translate(0, -149)

  const slowSway = Math.sin(time / 410) * 3.8
  const quickSway = Math.sin(time / 79) * 1.6
  const flutter = Math.sin(time / 31) * 1.2 + Math.sin(time / 53) * 0.8
  const lean = slowSway + quickSway
  const tipX = 60 + lean
  const tipY = 32 - flutter

  const halo = context.createRadialGradient(60, 128, 2, 60, 124, 43)
  halo.addColorStop(0, 'rgba(255,154,62,.2)')
  halo.addColorStop(.48, 'rgba(255,103,27,.08)')
  halo.addColorStop(1, 'rgba(255,74,12,0)')
  context.fillStyle = halo
  context.fillRect(12, 74, 96, 92)

  context.save()
  context.lineJoin = 'round'
  context.shadowColor = 'rgba(255,112,30,.28)'
  context.shadowBlur = 9
  context.beginPath()
  context.moveTo(60, 149)
  context.bezierCurveTo(51, 142, 41 + slowSway * .35, 127, 41 + quickSway, 109 + flutter)
  context.bezierCurveTo(39 + quickSway, 89, 48 + slowSway * .5, 69, 55 + lean * .55, 52)
  context.bezierCurveTo(58 + lean * .8, 45, tipX - 1, 37, tipX, tipY)
  context.bezierCurveTo(65 + lean, 52, 77 + quickSway, 67, 79 + quickSway, 88)
  context.bezierCurveTo(83 + slowSway, 112, 74, 137, 60, 149)
  context.closePath()
  const envelope = context.createLinearGradient(60, 31, 60, 149)
  envelope.addColorStop(0, 'rgba(255,112,23,.32)')
  envelope.addColorStop(.28, 'rgba(255,119,20,.65)')
  envelope.addColorStop(.72, 'rgba(255,146,31,.92)')
  envelope.addColorStop(1, 'rgba(255,193,75,.96)')
  context.fillStyle = envelope
  context.fill()
  context.restore()

  context.beginPath()
  context.moveTo(60, 146)
  context.bezierCurveTo(52, 137, 48 + quickSway, 124, 49 + quickSway, 108)
  context.bezierCurveTo(50, 91, 57 + lean * .45, 77, 61 + lean * .7, 62 + flutter)
  context.bezierCurveTo(67 + lean * .55, 78, 72 + quickSway, 95, 71 + quickSway, 112)
  context.bezierCurveTo(71, 128, 67, 140, 60, 146)
  context.closePath()
  const innerFlame = context.createLinearGradient(60, 61, 60, 146)
  innerFlame.addColorStop(0, 'rgba(255,175,54,.22)')
  innerFlame.addColorStop(.38, 'rgba(255,190,68,.64)')
  innerFlame.addColorStop(1, 'rgba(255,224,126,.9)')
  context.fillStyle = innerFlame
  context.fill()

  context.beginPath()
  context.moveTo(60, 145)
  context.bezierCurveTo(56, 137, 55, 128, 57 + quickSway * .25, 118)
  context.bezierCurveTo(58, 111, 60, 105, 62 + lean * .2, 99 + flutter)
  context.bezierCurveTo(66, 113, 66, 128, 63, 138)
  context.bezierCurveTo(62, 142, 61, 144, 60, 145)
  context.closePath()
  const hotCore = context.createLinearGradient(60, 98, 60, 145)
  hotCore.addColorStop(0, 'rgba(255,247,200,.08)')
  hotCore.addColorStop(.42, 'rgba(255,248,211,.72)')
  hotCore.addColorStop(1, 'rgba(255,255,226,.96)')
  context.fillStyle = hotCore
  context.fill()

  const blueBase = context.createRadialGradient(60, 146, 0, 60, 146, 7)
  blueBase.addColorStop(0, 'rgba(179,206,255,.5)')
  blueBase.addColorStop(1, 'rgba(122,168,255,0)')
  context.fillStyle = blueBase
  context.beginPath()
  context.ellipse(60, 145, 6, 8, 0, 0, Math.PI * 2)
  context.fill()
  context.restore()
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
