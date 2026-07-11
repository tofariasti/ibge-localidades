export type Theme = 'light' | 'dark'

const THEME_KEY = 'ibge-theme:v1'
const CHANGE_EVENT = 'ibge-theme-change'

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* ignore */
  }
  return null
}

export function resolveTheme(stored: Theme | null): Theme {
  if (stored) return stored
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
  applyTheme(theme)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function subscribeTheme(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(CHANGE_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function themeSnapshot(): string {
  return document.documentElement.dataset.theme ?? 'light'
}
