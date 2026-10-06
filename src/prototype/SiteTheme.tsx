import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'

export type SiteTheme = 'morning' | 'night'
type SiteThemeContextValue = { theme: SiteTheme; toggleTheme: () => void }

const SiteThemeContext = createContext<SiteThemeContextValue>({
  theme: 'morning',
  toggleTheme: () => undefined,
})
const STORAGE_KEY = 'webnest-theme'

function readSavedTheme(): SiteTheme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'night' ? 'night' : 'morning'
  } catch {
    return 'morning'
  }
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>(readSavedTheme)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // The theme still works when storage is unavailable.
    }
  }, [theme])

  const toggleTheme = () => setTheme((current) => current === 'morning' ? 'night' : 'morning')
  return <SiteThemeContext.Provider value={{ theme, toggleTheme }}>{children}</SiteThemeContext.Provider>
}

export function useSiteTheme() {
  return useContext(SiteThemeContext)
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useSiteTheme()
  const Icon = theme === 'morning' ? Sun : Moon
  const nextTheme = theme === 'morning' ? 'night' : 'morning'
  const label = theme === 'morning' ? 'Morning' : 'Night'

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'night'}
      title={`Switch to ${nextTheme} theme`}
      onClick={toggleTheme}
    >
      <Icon aria-hidden="true" weight="regular" />
      <span>{label}</span>
    </button>
  )
}
