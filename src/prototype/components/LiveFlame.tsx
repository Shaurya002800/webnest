import { useEffect, useRef } from 'react'

type LiveFlameProps = { reducedMotion?: boolean }

export function LiveFlame({ reducedMotion = false }: LiveFlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    let context: CanvasRenderingContext2D | null = null
    try { context = canvas.getContext('2d') } catch { return }
    if (!context) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = 120 * dpr
    canvas.height = 180 * dpr
    context.scale(dpr, dpr)
    let frame = 0
    let animation = 0

    const draw = (time: number) => {
      context!.clearRect(0, 0, 120, 180)
      const flicker = Math.sin(time / 93) * 2.2 + Math.sin(time / 47) * 1.1
      const lean = Math.sin(time / 530) * 4
      context!.globalCompositeOperation = 'lighter'

      const aura = context!.createRadialGradient(60, 118, 2, 60, 118, 56)
      aura.addColorStop(0, 'rgba(255,152,40,.38)')
      aura.addColorStop(.45, 'rgba(255,86,17,.13)')
      aura.addColorStop(1, 'rgba(255,66,0,0)')
      context!.fillStyle = aura
      context!.fillRect(0, 56, 120, 124)

      context!.beginPath()
      context!.moveTo(60, 148)
      context!.bezierCurveTo(38 + lean, 126, 45 + lean, 91 + flicker, 63 + lean, 48 - flicker)
      context!.bezierCurveTo(82 + lean, 90, 83, 125, 60, 148)
      const body = context!.createLinearGradient(60, 45, 60, 150)
      body.addColorStop(0, 'rgba(255,82,18,.08)')
      body.addColorStop(.48, 'rgba(255,91,20,.84)')
      body.addColorStop(1, 'rgba(255,210,91,.98)')
      context!.fillStyle = body
      context!.fill()

      context!.beginPath()
      context!.moveTo(60, 145)
      context!.bezierCurveTo(50, 132, 54, 109, 62 + lean * .35, 83 - flicker * .4)
      context!.bezierCurveTo(70, 111, 71, 135, 60, 145)
      context!.fillStyle = 'rgba(255,246,190,.92)'
      context!.fill()
      context!.globalCompositeOperation = 'source-over'
      frame += 1
      animation = requestAnimationFrame(draw)
    }
    animation = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animation)
  }, [reducedMotion])

  return (
    <span className="live-flame" data-testid="live-flame" data-reduced-motion={String(reducedMotion)} aria-hidden="true">
      <canvas ref={canvasRef} width="120" height="180" />
      <span className="live-flame__still" />
    </span>
  )
}

