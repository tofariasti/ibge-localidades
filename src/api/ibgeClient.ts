const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades'

export class IbgeApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'IbgeApiError'
  }
}

export async function ibgeFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new IbgeApiError(
      `Erro na API IBGE (${response.status}): ${response.statusText}`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}
