import { useCallback, useSyncExternalStore } from 'react'
import {
  persistTheme,
  readStoredTheme,
  resolveTheme,
  subscribeTheme,
  themeSnapshot,
  type Theme,
} from '../lib/theme'

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    themeSnapshot,
    () => 'light',
  ) as Theme

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next)
  }, [])

  const toggle = useCallback(() => {
    const current = resolveTheme(readStoredTheme())
    persistTheme(current === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, setTheme, toggle }
}
