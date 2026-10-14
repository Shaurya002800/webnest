import { useEffect, useRef } from 'react'

export function ButterflyCursor() {
  const ref = useRef<HTMLImageElement>(null)
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
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    query.addEventListener('change', hide)
    return () => {
      hide()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      query.removeEventListener('change', hide)
    }
  }, [])
  return <img ref={ref} className="butterfly-cursor" src="/assets/optimized/butterfly.png" alt="" aria-hidden="true" />
}
