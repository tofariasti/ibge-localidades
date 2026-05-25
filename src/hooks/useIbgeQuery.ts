/* eslint-disable react-hooks/set-state-in-effect -- hook de fetch com reset de loading por dependência */
import { useEffect, useState } from 'react'

interface UseIbgeQueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useIbgeQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseIbgeQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return {
    data,
    loading,
    error,
    refetch: () => setTick((n) => n + 1),
  }
}
