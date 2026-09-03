import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  label: string
}

export function ViewportScene({ children, label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setMounted(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setMounted(entry.isIntersecting), {
      rootMargin: '20% 0px',
      threshold: 0,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="viewport-scene" data-scene={label} data-scene-mounted={String(mounted)}>
      {mounted ? children : null}
    </div>
  )
}
