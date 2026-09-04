import { Homepage } from './prototype/components/Homepage'
import { InquiryPage } from './prototype/components/InquiryPage'

export function App() {
  if (window.location.pathname === '/free-audit') return <InquiryPage kind="audit" />
  if (window.location.pathname === '/start-project') return <InquiryPage kind="project" />
  return <Homepage />
}
