import { IbgeApiError } from './ibgeClient'

/** API de Nomes v2 (Censo 2010) — frequência e ranking. */
export const IBGE_NOMES_BASE =
  'https://servicodados.ibge.gov.br/api/v2/censos/nomes'

export function buildNomesUrl(
  path: string,
  params?: Record<string, string>,
): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${IBGE_NOMES_BASE}${normalized}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export async function nomesFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const response = await fetch(buildNomesUrl(path, params))

  if (!response.ok) {
    throw new IbgeApiError(
      `Erro na API de Nomes IBGE (${response.status}): ${response.statusText}`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}
