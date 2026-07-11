import { buildCacheKey, cachedFetch } from './cache'
import { agregadosFetch, buildAgregadosUrl } from './agregadosClient'
import { IbgeApiError } from './ibgeClient'
import type {
  IndicatorValue,
  LocalidadeIndicators,
} from '../types/indicadores'

/**
 * Fonte: API de Agregados v3, tabela 4714 (Censo Demográfico 2022) —
 * população residente, área territorial e densidade. Pública, sem chave.
 * Preferimos Agregados a apisidra.ibge.gov.br pelo JSON estruturado.
 */
export const CENSO_2022_AGREGADO = '4714'
export const CENSO_2022_PERIODO = '2022'

const VAR_POPULACAO = '93'
const VAR_AREA = '6318'
const VAR_DENSIDADE = '614'

const DETAIL_VARS = `${VAR_POPULACAO}|${VAR_AREA}|${VAR_DENSIDADE}`

interface AgregadoSerie {
  localidade: { id: string; nome: string }
  serie: Record<string, string>
}

interface AgregadoVariavel {
  id: string
  variavel: string
  unidade: string
  resultados: Array<{ series: AgregadoSerie[] }>
}

function parseNumber(raw: string | undefined): number | null {
  if (raw == null || raw === '' || raw === '...') return null
  const n = Number(raw.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function formatQueriedAt(): string {
  return new Date().toISOString()
}

function sourceMeta() {
  return {
    sourceLabel: 'Censo Demográfico 2022 — dados IBGE (Agregados)',
    sourceUrl: buildAgregadosUrl(`/${CENSO_2022_AGREGADO}`),
  }
}

function extractIndicators(
  payload: AgregadoVariavel[],
  period: string,
): { localityId: string; localityName: string; indicators: IndicatorValue[] } {
  if (!payload.length) {
    throw new IbgeApiError('Agregado sem resultados para esta localidade.', 404)
  }

  const firstSeries = payload[0]?.resultados[0]?.series[0]
  if (!firstSeries) {
    throw new IbgeApiError('Agregado sem série para esta localidade.', 404)
  }

  const indicators: IndicatorValue[] = payload.map((item) => {
    const serie = item.resultados[0]?.series[0]
    return {
      id: item.id,
      label: item.variavel,
      value: parseNumber(serie?.serie[period]),
      unit: item.unidade,
    }
  })

  return {
    localityId: firstSeries.localidade.id,
    localityName: firstSeries.localidade.nome,
    indicators,
  }
}

async function fetchLocalidadeIndicators(
  nivel: 'N3' | 'N6',
  id: number | string,
): Promise<LocalidadeIndicators> {
  const localidades = `${nivel}[${id}]`
  const path = `/${CENSO_2022_AGREGADO}/periodos/${CENSO_2022_PERIODO}/variaveis/${DETAIL_VARS}`
  const key = buildCacheKey(`agregados${path}`, { localidades })

  return cachedFetch(key, async () => {
    const payload = await agregadosFetch<AgregadoVariavel[]>(path, {
      localidades,
    })
    const extracted = extractIndicators(payload, CENSO_2022_PERIODO)
    return {
      ...extracted,
      period: CENSO_2022_PERIODO,
      queriedAt: formatQueriedAt(),
      ...sourceMeta(),
    }
  })
}

export function getIndicadoresEstado(
  ufId: number | string,
): Promise<LocalidadeIndicators> {
  return fetchLocalidadeIndicators('N3', ufId)
}

export function getIndicadoresMunicipio(
  municipioId: number | string,
): Promise<LocalidadeIndicators> {
  return fetchLocalidadeIndicators('N6', municipioId)
}

export function formatIndicatorValue(
  value: number | null,
  unit: string,
): string {
  if (value == null) return '—'
  const isPeople = /pessoas/i.test(unit)
  const isArea = /quilômetro|quilometro|km/i.test(unit)
  const isDensity = /habitante/i.test(unit)

  if (isPeople) {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(
      value,
    )
  }
  if (isArea) {
    return `${new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 3,
    }).format(value)} km²`
  }
  if (isDensity) {
    return `${new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 2,
    }).format(value)} hab/km²`
  }
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatQueryDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
