export type AnalyticsEvent = {
  name: string
  properties?: Record<string, string | number | boolean>
}

export function trackAnalytics(name: string, properties: AnalyticsEvent['properties'] = {}) {
  window.dispatchEvent(new CustomEvent<AnalyticsEvent>('webnest:analytics', { detail: { name, properties } }))
  const endpoint = document.querySelector<HTMLMetaElement>('meta[name="webnest-analytics"]')?.content
  if (!endpoint) return
  void fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, path: window.location.pathname, properties }),
    keepalive: true,
  }).catch(() => undefined)
}
