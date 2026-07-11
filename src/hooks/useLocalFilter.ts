import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { matchesQuery } from '../lib/text'

/** Filtro local sincronizado com `?q=` na URL (compartilhável). */
export function useLocalFilter<T>(
  items: T[],
  getSearchText: (item: T) => string,
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (!value.trim()) next.delete('q')
          else next.set('q', value)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    return items.filter((item) => matchesQuery(getSearchText(item), query))
  }, [items, query, getSearchText])

  return {
    query,
    setQuery,
    filtered,
    total: items.length,
    shown: filtered.length,
  }
}
