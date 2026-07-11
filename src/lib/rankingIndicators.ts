import type { RankingIndicatorKey } from '../types/indicadores'

export type { RankingIndicatorKey }

export interface RankingIndicatorOption {
  key: RankingIndicatorKey
  variableId: string
  shortLabel: string
}

/** Indicadores do Censo 2022 (agregado 4714) usados em rankings. */
export const RANKING_INDICATORS: RankingIndicatorOption[] = [
  {
    key: 'populacao',
    variableId: '93',
    shortLabel: 'População',
  },
  {
    key: 'area',
    variableId: '6318',
    shortLabel: 'Área',
  },
  {
    key: 'densidade',
    variableId: '614',
    shortLabel: 'Densidade',
  },
]

const KEY_BY_VARIABLE = Object.fromEntries(
  RANKING_INDICATORS.map((item) => [item.variableId, item.key]),
) as Record<string, RankingIndicatorKey>

export function parseRankingIndicator(
  raw: string | null | undefined,
): RankingIndicatorKey {
  if (raw === 'area' || raw === 'densidade' || raw === 'populacao') return raw
  if (raw && KEY_BY_VARIABLE[raw]) return KEY_BY_VARIABLE[raw]
  return 'populacao'
}

export function getRankingIndicator(
  key: RankingIndicatorKey,
): RankingIndicatorOption {
  return (
    RANKING_INDICATORS.find((item) => item.key === key) ?? RANKING_INDICATORS[0]
  )
}
