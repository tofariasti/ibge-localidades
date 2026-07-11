export type NomeSexo = 'M' | 'F'

export interface NomeFrequenciaPoint {
  periodo: string
  frequencia: number
}

export interface NomeFrequenciaResult {
  nome: string
  localidade: string
  sexo: string | null
  points: NomeFrequenciaPoint[]
  queriedAt: string
  sourceLabel: string
  sourceUrl: string
}

export interface NomeRankingEntry {
  rank: number
  nome: string
  frequencia: number
}

export interface NomeRankingResult {
  localidade: string
  sexo: string | null
  entries: NomeRankingEntry[]
  queriedAt: string
  sourceLabel: string
  sourceUrl: string
}
