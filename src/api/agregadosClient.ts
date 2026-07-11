import { IbgeApiError } from './ibgeClient'

/** API de Agregados v3 (mesmos dados do SIDRA, sem chave). */
export const IBGE_AGREGADOS_BASE =
  'https://servicodados.ibge.gov.br/api/v3/agregados'

export function buildAgregadosUrl(
  path: string,
  params?: Record<string, string>,
): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${IBGE_AGREGADOS_BASE}${normalized}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export async function agregadosFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const response = await fetch(buildAgregadosUrl(path, params))

  if (!response.ok) {
    throw new IbgeApiError(
      `Erro na API de Agregados IBGE (${response.status}): ${response.statusText}`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}
