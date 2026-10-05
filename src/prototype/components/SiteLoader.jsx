import { useEffect, useRef, useState } from 'react'
import { getLoaderButterflyPoint } from '../butterfly-path'

const HOME_IMAGES = [
  '/assets/generated/hero-room-clean.png',
  '/assets/generated/building-night.png',
  '/assets/generated/butterfly.png',
]
const INQUIRY_IMAGES = ['/assets/cinematic/final-bg.jpg', '/assets/generated/butterfly.png']
const OPENING_FONTS = [
  '400 96px "Newsreader"',
  '500 96px "Newsreader"',
  '400 16px "DM Sans"',
  '500 16px "Bodoni Moda"',
]
const CHAPTERS = ['ROOM', 'CITY', 'GROWTH']

function preloadImage(source) {
  return new Promise((resolve) => {
    const image = Array.from(document.images).find((candidate) => (
      candidate.getAttribute('src') === source && !candidate.closest('.site-loader')
    )) || new window.Image()
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    const decode = () => {
      if (typeof image.decode !== 'function') {
        finish()
        return
      }
      image.decode().then(finish, finish)
    }

    image.addEventListener('load', decode, { once: true })
    image.addEventListener('error', finish, { once: true })
    if (!image.getAttribute('src')) image.src = source
    if (image.complete) decode()
  })
}

function preloadFont(descriptor) {
  if (!document.fonts?.load) return Promise.resolve()
  return document.fonts.load(descriptor).then(() => undefined, () => undefined)
}

export function SiteLoader({ pathname }) {
  const isInquiryPage = pathname === '/free-audit' || pathname === '/start-project'
  const imageSources = isInquiryPage ? INQUIRY_IMAGES : HOME_IMAGES
  const backdrop = isInquiryPage ? '/assets/cinematic/final-bg.jpg' : HOME_IMAGES[0]
  const [progress, setProgress] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const routePathRef = useRef(null)
  const flightRef = useRef(null)
  const flightProgressRef = useRef(0)
  const activeChapter = displayProgress < 34 ? 0 : displayProgress < 67 ? 1 : 2

  useEffect(() => {
    const path = routePathRef.current
    const butterfly = flightRef.current
    if (!path || !butterfly || typeof path.getTotalLength !== 'function' || typeof path.getScreenCTM !== 'function') return

    let frame = 0
    const from = flightProgressRef.current
    const distance = Math.abs(progress - from)
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 0 : 2400 * distance / 100
    const startedAt = performance.now()
    const pathLength = path.getTotalLength()

    const draw = (value) => {
      const point = path.getPointAtLength(pathLength * value / 100)
      const matrix = path.getScreenCTM()
      if (!matrix || !path.ownerSVGElement) return
      const svgPoint = path.ownerSVGElement.createSVGPoint()
      svgPoint.x = point.x
      svgPoint.y = point.y
      const position = svgPoint.matrixTransform(matrix)
      const pose = getLoaderButterflyPoint(value / 100)
      path.style.strokeDashoffset = String(100 - value)
      butterfly.style.left = `${position.x}px`
      butterfly.style.top = `${position.y}px`
      butterfly.style.setProperty('--loader-flight-rotation', `${pose.rotation}deg`)
      flightProgressRef.current = value
      setDisplayProgress(Math.floor(value))
    }

    if (!duration) {
      draw(progress)
      return undefined
    }

    const animate = (now) => {
      const amount = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - amount, 3)
      draw(from + (progress - from) * eased)
      if (amount < 1) frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [progress])

  useEffect(() => {
    let cancelled = false
    const timers = []
    let timeoutId
    const startedAt = performance.now()
    document.documentElement.classList.add('site-is-loading')

    const wait = (duration) => new Promise((resolve) => {
      const timer = window.setTimeout(resolve, duration)
      timers.push(timer)
    })

    const tasks = [
      ...imageSources.map(preloadImage),
      Promise.all(OPENING_FONTS.map(preloadFont)),
    ]
    let completed = 0
    const trackedTasks = tasks.map((task) => Promise.resolve(task).then(() => {
      if (cancelled) return
      completed += 1
      setProgress(Math.min(99, Math.round((completed / tasks.length) * 99)))
    }, () => {
      if (cancelled) return
      completed += 1
      setProgress(Math.min(99, Math.round((completed / tasks.length) * 99)))
    }))

    const reveal = async () => {
      const loadingLimit = new Promise((resolve) => {
        timeoutId = window.setTimeout(resolve, 12000)
      })
      const timedOut = await Promise.race([
        Promise.all(trackedTasks).then(() => false),
        loadingLimit.then(() => true),
      ])
      window.clearTimeout(timeoutId)
      if (cancelled) return

      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      const minimumTime = reducedMotion ? 350 : 900
      await wait(Math.max(0, minimumTime - (performance.now() - startedAt), reducedMotion ? 0 : 2400))
      if (cancelled) return

      setProgress(100)
      await wait(reducedMotion ? 0 : timedOut ? 2400 : 200)
      if (cancelled) return

      setExiting(true)
      await wait(reducedMotion ? 50 : 750)
      if (cancelled) return

      document.documentElement.classList.remove('site-is-loading')
      setVisible(false)
    }

    void reveal()
    return () => {
      cancelled = true
      timers.forEach(window.clearTimeout)
      window.clearTimeout(timeoutId)
      document.documentElement.classList.remove('site-is-loading')
    }
  }, [imageSources])

  if (!visible) return null

  return (
    <div
      className={`site-loader${exiting ? ' site-loader--exiting' : ''}`}
      role="region"
      aria-label="Loading WebNest"
      aria-live="polite"
    >
      <div className="site-loader__backdrop" aria-hidden="true">
        <img src={backdrop} alt="" />
      </div>
      <div className="site-loader__shade" aria-hidden="true" />
      {!isInquiryPage && <svg className="site-loader__route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={routePathRef} d="M 4 82 C 20 82 85 100 72 38" pathLength="100" />
      </svg>}
      {!isInquiryPage && <div ref={flightRef} className="site-loader__flight" aria-hidden="true"><img src="/assets/generated/butterfly.png" alt="" /></div>}
      <div className="site-loader__brand" aria-hidden="true"><span>W</span> WebNest</div>
      <div className="site-loader__content">
        <p className="site-loader__eyebrow"><span /> WebNest <i /> The journey begins</p>
        <h1 className="site-loader__title">Opening the<br /><em>studio.</em></h1>
        <div
          className="site-loader__progress"
          role="progressbar"
          aria-label="Opening scene"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayProgress}
          aria-valuetext={`${displayProgress}% loaded`}
        >
          {isInquiryPage && <div className="site-loader__track"><span className="site-loader__fill" style={{ width: `${progress}%` }} /></div>}
          <div className="site-loader__meta">
            <span>{displayProgress === 100 ? 'The door is open' : ['Setting the room', 'Opening the window', 'Calling in the city'][activeChapter]}</span>
            <strong>{String(displayProgress).padStart(2, '0')}%</strong>
          </div>
        </div>
        <div className="site-loader__chapters" aria-hidden="true">
          {CHAPTERS.map((chapter, index) => (
            <span className={index < activeChapter ? 'is-complete' : index === activeChapter ? 'is-active' : ''} key={chapter}>
              <small>0{index + 1}</small>{chapter}
            </span>
          ))}
        </div>
      </div>
      <p className="site-loader__footer">WEBNEST <span>·</span> DIGITAL GROWTH STUDIO</p>
    </div>
  )
}