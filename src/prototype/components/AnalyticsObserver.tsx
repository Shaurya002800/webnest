import { useEffect } from 'react'
import { trackAnalytics } from '../analytics'

export function AnalyticsObserver() {
  useEffect(() => {
    trackAnalytics('page_view')
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('a,button') : null
      if (!target) return
      const href = target instanceof HTMLAnchorElement ? target.getAttribute('href') || '' : ''
      if (href.startsWith('/free-audit')) trackAnalytics('audit_cta_clicked', { location: target.closest('section,header,footer')?.id || 'unknown' })
      if (href.startsWith('/start-project')) {
        const packageName = new URL(href, window.location.origin).searchParams.get('package') || 'unspecified'
        trackAnalytics('project_cta_clicked', { location: target.closest('section,header,footer')?.id || 'unknown', package: packageName })
      }
      if (target.classList.contains('theme-toggle')) trackAnalytics('theme_toggled', { nextTheme: document.documentElement.dataset.theme === 'night' ? 'morning' : 'night' })
      if (target.closest('.faq-road-scene__list')) trackAnalytics('faq_toggled', { question: target.textContent?.trim().slice(0, 100) || 'unknown' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
