import { useEffect } from 'react'

type RouteMetaProps = {
  title: string
  description: string
  noIndex?: boolean
}

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value))
}

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }
  element.href = href
}

export function RouteMeta({ title, description, noIndex = false }: RouteMetaProps) {
  useEffect(() => {
    const canonical = `${window.location.origin}${window.location.pathname}`
    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'WebNest' })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: `${window.location.origin}/assets/optimized/hero-room-clean.jpg` })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: `${window.location.origin}/assets/optimized/hero-room-clean.jpg` })
    upsertLink('canonical', canonical)
    const existingSchema = document.head.querySelector<HTMLScriptElement>('script[data-webnest-schema]')
    if (window.location.pathname === '/') {
      const schema = existingSchema || document.createElement('script')
      schema.type = 'application/ld+json'
      schema.dataset.webnestSchema = 'true'
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'WebNest',
        url: window.location.origin,
        email: 'hello@webnest.in',
        description,
        areaServed: 'India',
        serviceType: ['Web development', 'SEO and growth', 'Business automation', 'AI solutions'],
      })
      if (!existingSchema) document.head.appendChild(schema)
    } else {
      existingSchema?.remove()
    }
  }, [description, noIndex, title])

  return null
}
