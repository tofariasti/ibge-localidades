import { useMemo, useState } from 'react'
import { matchesQuery } from '../lib/text'

export function useLocalFilter<T>(
  items: T[],
  getSearchText: (item: T) => string,
) {
  const [query, setQuery] = useState('')

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
