import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { ThemeToggle } from '../SiteTheme'

export function NotFoundPage() {
  return <main className="not-found-page">
    <ThemeToggle className="theme-toggle--inquiry" />
    <a className="inquiry-page__back" href="/"><ArrowLeft />Back to the journey</a>
    <section>
      <p className="eyebrow"><span />404 · Route not found</p>
      <h1>This road ends here.</h1>
      <p>The page you asked for is not part of the WebNest journey.</p>
      <a className="button button--primary" href="/">Return home <ArrowRight /></a>
    </section>
  </main>
}
