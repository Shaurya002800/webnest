import { Homepage } from './prototype/components/Homepage'
import { InquiryPage } from './prototype/components/InquiryPage'
import { SiteLoader } from './prototype/components/SiteLoader'

export function App() {
  const pathname = window.location.pathname

  return <>
    <SiteLoader pathname={pathname} />
    {pathname === '/free-audit' ? <InquiryPage kind="audit" /> : null}
    {pathname === '/start-project' ? <InquiryPage kind="project" /> : null}
    {pathname !== '/free-audit' && pathname !== '/start-project' ? <Homepage /> : null}
  </>
}
