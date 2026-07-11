/** Indicador demográfico de uma localidade (UF ou município). */
export interface IndicatorValue {
  id: string
  label: string
  value: number | null
  unit: string
}

/** Painel de indicadores de uma única localidade. */
export interface LocalidadeIndicators {
  localityId: string
  localityName: string
  /** Ano de referência do agregado (ex.: "2022"). */
  period: string
  /** Instantâneo em que a consulta foi feita (ISO). */
  queriedAt: string
  sourceLabel: string
  sourceUrl: string
  indicators: IndicatorValue[]
}

/** Valores de um indicador por UF (mapa coroplético). */
export interface UfIndicatorSeries {
  period: string
  variableId: string
  variableLabel: string
  unit: string
  queriedAt: string
  sourceLabel: string
  sourceUrl: string
  /** Chave = id IBGE da UF. */
  valuesByUfId: Record<number, number>
}

/** Chaves de indicador disponíveis nos rankings (Censo 2022). */
export type RankingIndicatorKey = 'populacao' | 'area' | 'densidade'

export interface RankingEntry {
  rank: number
  id: number
  name: string
  value: number
  /** Rota de detalhe no app (`/estados/:id` ou `/municipios/:id`). */
  detailPath: string
}

/** Ranking ordenado (maior → menor) de um indicador. */
export interface IndicatorRanking {
  scope: 'uf' | 'municipio'
  /** Preenchido quando `scope === 'municipio'`. */
  ufId?: number
  ufName?: string
  period: string
  variableId: string
  variableLabel: string
  unit: string
  queriedAt: string
  sourceLabel: string
  sourceUrl: string
  entries: RankingEntry[]
}
