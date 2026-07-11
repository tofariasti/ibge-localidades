import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { embedPath, parseEmbedBrand, type EmbedBrand } from '../lib/embedBrand'

export function useEmbedBrand(): EmbedBrand {
  const [searchParams] = useSearchParams()
  return useMemo(() => parseEmbedBrand(searchParams), [searchParams])
}

/** Preserva query de marca ao navegar dentro do embed. */
export function useEmbedPath() {
  const [searchParams] = useSearchParams()
  return useMemo(
    () =>
      (
        path: string,
        extra?: Record<string, string | null | undefined>,
      ): string => embedPath(path, searchParams, extra),
    [searchParams],
  )
}
