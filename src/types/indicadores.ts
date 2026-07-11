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
