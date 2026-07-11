/** Ponto de uma série temporal (período → valor). */
export interface TimeSeriesPoint {
  period: string
  value: number | null
}

/** Série temporal de uma localidade (UF ou município). */
export interface LocalidadeTimeSeries {
  localityId: string
  localityName: string
  variableId: string
  variableLabel: string
  unit: string
  points: TimeSeriesPoint[]
  queriedAt: string
  sourceLabel: string
  sourceUrl: string
}
