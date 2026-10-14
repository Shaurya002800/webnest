import { useEffect, useRef } from 'react'

export function ButterflyCursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const query = matchMedia('(hover: hover) and (pointer: fine)')
    const hide = () => {
      document.documentElement.classList.remove('butterfly-cursor-active')
      if (ref.current) ref.current.style.opacity = '0'
    }
    const move = (event: PointerEvent) => {
      if (!query.matches || event.pointerType === 'touch' || !ref.current) return hide()
      const editing = event.target instanceof Element && !!event.target.closest('input,textarea,select,[contenteditable="true"]')
      if (editing) return hide()
      ref.current.style.transform = `translate3d(${event.clientX - 16}px,${event.clientY - 16}px,0)`
      ref.current.style.opacity = '1'
      document.documentElement.classList.add('butterfly-cursor-active')
    }
    const flap = () => {
      if (!query.matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
      ref.current?.querySelectorAll('img').forEach((wing, index) => {
        wing.getAnimations().forEach(animation => animation.cancel())
        wing.animate([
          { transform: 'perspective(90px) rotateY(0deg)' },
          { transform: `perspective(90px) rotateY(${index ? -72 : 72}deg)` },
          { transform: 'perspective(90px) rotateY(0deg)' },
        ], { duration: 180, iterations: 3, easing: 'ease-in-out' })
      })
    }
    document.addEventListener('pointerdown', flap)
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    query.addEventListener('change', hide)
    return () => {
      hide()
      document.removeEventListener('pointerdown', flap)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      query.removeEventListener('change', hide)
    }
  }, [])
  return <div ref={ref} className="butterfly-cursor" aria-hidden="true"><img className="cursor-wing cursor-wing--left" src="/assets/optimized/butterfly.png" alt="" /><img className="cursor-wing cursor-wing--right" src="/assets/optimized/butterfly.png" alt="" /></div>
}
