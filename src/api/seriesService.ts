import { buildCacheKey, cachedFetch } from './cache'
import { agregadosFetch, buildAgregadosUrl } from './agregadosClient'
import { IbgeApiError } from './ibgeClient'
import {
  formatIndicatorValue,
  formatQueryDate,
} from './indicadoresService'
import type { LocalidadeTimeSeries, TimeSeriesPoint } from '../types/series'

/**
 * Estimativas de População (SIDRA/Agregados tabela 6579) —
 * série anual por UF (N3) ou município (N6).
 */
export const ESTIMATIVAS_AGREGADO = '6579'
export const VAR_POP_ESTIMADA = '9324'
/** Últimos períodos disponíveis na API (`-8`). */
export const SERIES_PERIODS = '-8'

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

function toPoints(serie: Record<string, string>): TimeSeriesPoint[] {
  return Object.keys(serie)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((period) => ({
      period,
      value: parseNumber(serie[period]),
    }))
}

async function fetchEstimativaSeries(
  nivel: 'N3' | 'N6',
  id: number | string,
): Promise<LocalidadeTimeSeries> {
  const localidades = `${nivel}[${id}]`
  const path = `/${ESTIMATIVAS_AGREGADO}/periodos/${SERIES_PERIODS}/variaveis/${VAR_POP_ESTIMADA}`
  const key = buildCacheKey(`agregados${path}`, { localidades })

  return cachedFetch(key, async () => {
    const payload = await agregadosFetch<AgregadoVariavel[]>(path, {
      localidades,
    })
    const item = payload[0]
    const row = item?.resultados[0]?.series[0]
    if (!item || !row) {
      throw new IbgeApiError('Sem série de estimativas para esta localidade.', 404)
    }

    const points = toPoints(row.serie)
    if (points.every((p) => p.value == null)) {
      throw new IbgeApiError('Série sem valores numéricos.', 404)
    }

    return {
      localityId: row.localidade.id,
      localityName: row.localidade.nome,
      variableId: item.id,
      variableLabel: item.variavel,
      unit: item.unidade,
      points,
      queriedAt: new Date().toISOString(),
      sourceLabel: 'Estimativas de População — dados IBGE (Agregados/SIDRA)',
      sourceUrl: buildAgregadosUrl(`/${ESTIMATIVAS_AGREGADO}`),
    }
  })
}

export function getSerieEstado(
  ufId: number | string,
): Promise<LocalidadeTimeSeries> {
  return fetchEstimativaSeries('N3', ufId)
}

export function getSerieMunicipio(
  municipioId: number | string,
): Promise<LocalidadeTimeSeries> {
  return fetchEstimativaSeries('N6', municipioId)
}

export { formatIndicatorValue, formatQueryDate }
