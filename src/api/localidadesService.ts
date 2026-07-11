import { buildCacheKey, cachedFetch } from './cache'
import { IbgeApiError, ibgeFetch } from './ibgeClient'
import type {
  Mesorregiao,
  Microrregiao,
  Municipio,
  Pais,
  Regiao,
  RegiaoImediata,
  RegiaoIntermediaria,
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

export function getRegioesIntermediariasPorUF(
  ufId: number | string,
): Promise<RegiaoIntermediaria[]> {
  return listFetch<RegiaoIntermediaria[]>(
    `/estados/${ufId}/regioes-intermediarias`,
    { orderBy: 'nome' },
  )
}

export function getRegiaoIntermediaria(
  id: number | string,
): Promise<RegiaoIntermediaria> {
  return ibgeFetch<RegiaoIntermediaria>(`/regioes-intermediarias/${id}`)
}

export function getRegioesImediatasPorUF(
  ufId: number | string,
): Promise<RegiaoImediata[]> {
  return listFetch<RegiaoImediata[]>(`/estados/${ufId}/regioes-imediatas`, {
    orderBy: 'nome',
  })
}

export function getRegioesImediatasPorIntermediaria(
  intermediariaId: number | string,
): Promise<RegiaoImediata[]> {
  return listFetch<RegiaoImediata[]>(
    `/regioes-intermediarias/${intermediariaId}/regioes-imediatas`,
    { orderBy: 'nome' },
  )
}

export function getRegiaoImediata(id: number | string): Promise<RegiaoImediata> {
  return ibgeFetch<RegiaoImediata>(`/regioes-imediatas/${id}`)
}

export function getMunicipiosPorRegiaoImediata(
  imediataId: number | string,
): Promise<Municipio[]> {
  return listFetch<Municipio[]>(
    `/regioes-imediatas/${imediataId}/municipios`,
    { orderBy: 'nome' },
  )
}

export function getPaises(): Promise<Pais[]> {
  return listFetch<Pais[]>('/paises', { orderBy: 'nome' })
}

/** A API devolve um array mesmo para um código M49; normalizamos para um item. */
export async function getPais(id: number | string): Promise<Pais> {
  const result = await ibgeFetch<Pais[] | Pais>(`/paises/${id}`)
  const pais = Array.isArray(result) ? result[0] : result
  if (!pais) {
    throw new IbgeApiError(`País não encontrado (${id}).`, 404)
  }
  return pais
}
