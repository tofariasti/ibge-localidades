import { useEffect, useState } from 'react'
import {
  getEstados,
  getMunicipios,
  getRegioes,
} from '../api/localidadesService'
import type { SearchIndexData } from '../lib/searchLocalidades'

type SearchIndexState = {
  data: SearchIndexData | null
  loading: boolean
  error: string | null
}

let cachedIndex: SearchIndexData | null = null
let inflight: Promise<SearchIndexData> | null = null

async function loadSearchIndex(): Promise<SearchIndexData> {
  if (cachedIndex) return cachedIndex
  if (!inflight) {
    inflight = Promise.all([getRegioes(), getEstados(), getMunicipios()])
      .then(([regioes, estados, municipios]) => {
        cachedIndex = { regioes, estados, municipios }
        return cachedIndex
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

/** Carrega (e memoiza em módulo) o índice para a busca global. */
export function useSearchIndex(enabled: boolean): SearchIndexState {
  const [error, setError] = useState<string | null>(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!enabled || cachedIndex) return

    let cancelled = false

    void loadSearchIndex()
      .then(() => {
        if (!cancelled) {
          setError(null)
          setTick((t) => t + 1)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Falha ao carregar índice de busca.',
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  const data = enabled ? cachedIndex : null
  const loading = Boolean(enabled && !data && !error)

  return { data, loading, error }
}
