import { buildCacheKey, cachedFetch } from './cache'
import { buildNomesUrl, nomesFetch } from './nomesClient'
import { IbgeApiError } from './ibgeClient'
import type {
  NomeFrequenciaResult,
  NomeRankingResult,
  NomeSexo,
} from '../types/nomes'

interface NomesApiFrequencia {
  nome: string
  sexo: string | null
  localidade: string
  res: Array<{ periodo: string; frequencia: number }>
}

interface NomesApiRanking {
  localidade: string
  sexo: string | null
  res: Array<{ nome: string; frequencia: number; ranking: number }>
}

function normalizeNome(raw: string): string {
  return raw
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
}

export async function getFrequenciaNome(options: {
  nome: string
  localidade?: string
  sexo?: NomeSexo | ''
}): Promise<NomeFrequenciaResult> {
  const nome = normalizeNome(options.nome)
  if (!nome) {
    throw new IbgeApiError('Informe um nome para consultar.', 400)
  }

  const params: Record<string, string> = {}
  if (options.localidade) params.localidade = options.localidade
  if (options.sexo) params.sexo = options.sexo

  const path = `/${encodeURIComponent(nome)}`
  const key = buildCacheKey(`nomes${path}`, params)

  return cachedFetch(key, async () => {
    const payload = await nomesFetch<NomesApiFrequencia[]>(path, params)
    const first = payload[0]
    if (!first?.res?.length) {
      throw new IbgeApiError('Nenhum dado de frequência para este nome.', 404)
    }

    return {
      nome: first.nome,
      localidade: first.localidade,
      sexo: first.sexo,
      points: first.res.map((row) => ({
        periodo: row.periodo,
        frequencia: row.frequencia,
      })),
      queriedAt: new Date().toISOString(),
      sourceLabel: 'API de Nomes IBGE (Censo 2010)',
      sourceUrl: buildNomesUrl(path, params),
    }
  })
}

export async function getRankingNomes(options: {
  decada?: string
  localidade?: string
  sexo?: NomeSexo | ''
}): Promise<NomeRankingResult> {
  const params: Record<string, string> = {}
  if (options.decada) params.decada = options.decada
  if (options.localidade) params.localidade = options.localidade
  if (options.sexo) params.sexo = options.sexo

  const path = '/ranking'
  const key = buildCacheKey(`nomes${path}`, params)

  return cachedFetch(key, async () => {
    const payload = await nomesFetch<NomesApiRanking[]>(path, params)
    const first = payload[0]
    if (!first?.res?.length) {
      throw new IbgeApiError('Ranking de nomes sem resultados.', 404)
    }

    return {
      localidade: first.localidade,
      sexo: first.sexo,
      entries: first.res.map((row) => ({
        rank: row.ranking,
        nome: row.nome,
        frequencia: row.frequencia,
      })),
      queriedAt: new Date().toISOString(),
      sourceLabel: 'API de Nomes IBGE (Censo 2010)',
      sourceUrl: buildNomesUrl(path, params),
    }
  })
}

export function formatNomePeriodo(periodo: string): string {
  if (periodo === '1930[') return 'até 1930'
  const match = periodo.match(/^\[(\d{4}),(\d{4})\[$/)
  if (match) return `${match[1]}–${match[2]}`
  return periodo
}

export function formatFrequencia(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}
