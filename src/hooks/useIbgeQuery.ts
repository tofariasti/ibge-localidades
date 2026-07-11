/* eslint-disable react-hooks/set-state-in-effect -- hook de fetch com reset de loading por dependência */
import { useEffect, useRef, useState } from 'react'

interface UseIbgeQueryResult<T> {
  data: T | null
  /** True only while the first successful payload has not arrived yet. */
  loading: boolean
  /** True while a refetch is in flight (previous data may still be shown). */
  refetching: boolean
  error: string | null
  refetch: () => void
}

export function useIbgeQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  enabled = true,
): UseIbgeQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [refetching, setRefetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const prevRef = useRef<{ depsKey: string; tick: number } | null>(null)

  const depsKey = JSON.stringify(deps)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setRefetching(false)
      setError(null)
      setData(null)
      return
    }

    let cancelled = false
    const prev = prevRef.current
    const depsChanged = !prev || prev.depsKey !== depsKey
    const isRetry = Boolean(prev && !depsChanged && prev.tick !== tick)
    prevRef.current = { depsKey, tick }

    setError(null)

    if (depsChanged) {
      setData(null)
      setLoading(true)
      setRefetching(false)
    } else if (isRetry) {
      setRefetching(true)
    }

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
          if (depsChanged) {
            setData(null)
          }
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
          setRefetching(false)
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey, tick, enabled])

  return {
    data,
    loading: enabled && loading,
    refetching,
    error,
    refetch: () => setTick((n) => n + 1),
  }
}
