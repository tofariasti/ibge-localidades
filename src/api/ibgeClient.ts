export const IBGE_LOCALIDADES_BASE =
  'https://servicodados.ibge.gov.br/api/v1/localidades'

/** Monta a URL oficial da API de Localidades para um path (+ query opcional). */
export function buildIbgeApiUrl(
  path: string,
  params?: Record<string, string>,
): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${IBGE_LOCALIDADES_BASE}${normalized}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export class IbgeApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'IbgeApiError'
    this.status = status
  }
}

export async function ibgeFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const response = await fetch(buildIbgeApiUrl(path, params))

  if (!response.ok) {
    throw new IbgeApiError(
      `Erro na API IBGE (${response.status}): ${response.statusText}`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}
