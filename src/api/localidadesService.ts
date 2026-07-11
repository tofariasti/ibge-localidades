import { buildCacheKey, cachedFetch } from './cache'
import { ibgeFetch } from './ibgeClient'
import type {
  Mesorregiao,
  Microrregiao,
  Municipio,
  Regiao,
  UF,
} from '../types/localidades'

function listFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const key = buildCacheKey(path, params)
  return cachedFetch(key, () => ibgeFetch<T>(path, params))
}

export function getRegioes(): Promise<Regiao[]> {
  return listFetch<Regiao[]>('/regioes', { orderBy: 'nome' })
}

export function getRegiao(id: number | string): Promise<Regiao> {
  return ibgeFetch<Regiao>(`/regioes/${id}`)
}

export function getEstados(): Promise<UF[]> {
  return listFetch<UF[]>('/estados', { orderBy: 'nome' })
}

export function getEstado(id: number | string): Promise<UF> {
  return ibgeFetch<UF>(`/estados/${id}`)
}

export function getEstadosPorRegiao(regiaoId: number | string): Promise<UF[]> {
  return listFetch<UF[]>(`/regioes/${regiaoId}/estados`, { orderBy: 'nome' })
}

export function getMunicipiosPorUF(ufId: number | string): Promise<Municipio[]> {
  return listFetch<Municipio[]>(`/estados/${ufId}/municipios`, {
    orderBy: 'nome',
  })
}

/** Todos os municípios (usado pela busca global; cacheado). */
export function getMunicipios(): Promise<Municipio[]> {
  return listFetch<Municipio[]>('/municipios', { orderBy: 'nome' })
}

export function getMunicipio(id: number | string): Promise<Municipio> {
  return ibgeFetch<Municipio>(`/municipios/${id}`)
}

export function getMesorregioesPorUF(
  ufId: number | string,
): Promise<Mesorregiao[]> {
  return listFetch<Mesorregiao[]>(`/estados/${ufId}/mesorregioes`, {
    orderBy: 'nome',
  })
}

export function getMesorregiao(id: number | string): Promise<Mesorregiao> {
  return ibgeFetch<Mesorregiao>(`/mesorregioes/${id}`)
}

export function getMicrorregioesPorUF(
  ufId: number | string,
): Promise<Microrregiao[]> {
  return listFetch<Microrregiao[]>(`/estados/${ufId}/microrregioes`, {
    orderBy: 'nome',
  })
}

export function getMicrorregioesPorMesorregiao(
  mesorregiaoId: number | string,
): Promise<Microrregiao[]> {
  return listFetch<Microrregiao[]>(
    `/mesorregioes/${mesorregiaoId}/microrregioes`,
    { orderBy: 'nome' },
  )
}

export function getMicrorregiao(id: number | string): Promise<Microrregiao> {
  return ibgeFetch<Microrregiao>(`/microrregioes/${id}`)
}

export function getMunicipiosPorMicrorregiao(
  microrregiaoId: number | string,
): Promise<Municipio[]> {
  return listFetch<Municipio[]>(`/microrregioes/${microrregiaoId}/municipios`, {
    orderBy: 'nome',
  })
}
