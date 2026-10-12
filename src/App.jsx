import { useMemo } from 'react'
import { Homepage } from './prototype/components/Homepage'
import { AnalyticsObserver } from './prototype/components/AnalyticsObserver'
import { InquiryPage } from './prototype/components/InquiryPage'
import { LegalPage } from './prototype/components/LegalPage'
import { NotFoundPage } from './prototype/components/NotFoundPage'
import { RouteMeta } from './prototype/components/RouteMeta'
import { SiteLoader } from './prototype/components/SiteLoader'
import { SiteThemeProvider } from './prototype/SiteTheme'

const ROUTES = {
  '/': { title: 'WebNest — Connected digital growth systems', description: 'WebNest builds connected brands, websites, growth systems and automation for ambitious businesses.' },
  '/free-audit': { title: 'Free growth audit — WebNest', description: 'Request a free WebNest review of your website, visibility, customer journey and growth opportunities.' },
  '/start-project': { title: 'Start a project — WebNest', description: 'Tell WebNest what you want to build and get a clear recommendation for the right digital growth system.' },
  '/privacy': { title: 'Privacy policy — WebNest', description: 'How WebNest collects, uses, protects and retains information submitted through this website.' },
  '/terms': { title: 'Terms of use — WebNest', description: 'The terms that apply when using the WebNest website and submitting a business enquiry.' },
}

export function App() {
  const pathname = window.location.pathname
  const route = useMemo(() => ROUTES[pathname], [pathname])

  return <SiteThemeProvider><>
    <AnalyticsObserver />
    <SiteLoader pathname={pathname} />
    <RouteMeta title={route?.title || 'Page not found — WebNest'} description={route?.description || 'The requested page could not be found.'} noIndex={!route} />
    {pathname === '/free-audit' ? <InquiryPage kind="audit" /> : null}
    {pathname === '/start-project' ? <InquiryPage kind="project" /> : null}
    {pathname === '/privacy' ? <LegalPage kind="privacy" /> : null}
    {pathname === '/terms' ? <LegalPage kind="terms" /> : null}
    {pathname === '/' ? <Homepage /> : null}
    {!route ? <NotFoundPage /> : null}
  </></SiteThemeProvider>
}
