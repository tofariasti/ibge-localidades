import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  formatIndicatorValue,
  formatQueryDate,
} from '../api/indicadoresService'
import { DataList } from './DataList'
import { ListFilter } from './ListFilter'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { IndicatorRanking, RankingEntry } from '../types/indicadores'

type RankingTableProps = {
  ranking: IndicatorRanking
  filterId: string
}

export function RankingTable({ ranking, filterId }: RankingTableProps) {
  const getSearchText = useCallback(
    (entry: RankingEntry) => `${entry.rank} ${entry.id} ${entry.name}`,
    [],
  )
  const filter = useLocalFilter(ranking.entries, getSearchText)

  const columns = useMemo(
    () => [
      { header: '#', render: (entry: RankingEntry) => entry.rank },
      { header: 'ID', render: (entry: RankingEntry) => entry.id },
      { header: 'Nome', render: (entry: RankingEntry) => entry.name },
      {
        header: ranking.variableLabel,
        render: (entry: RankingEntry) =>
          formatIndicatorValue(entry.value, ranking.unit),
      },
    ],
    [ranking.unit, ranking.variableLabel],
  )

  return (
    <div className="ranking__table-wrap">
      <ListFilter
        id={filterId}
        value={filter.query}
        onChange={filter.setQuery}
        shown={filter.shown}
        total={filter.total}
        placeholder="Filtrar por nome, código ou posição…"
      />
      <DataList<RankingEntry>
        items={filter.filtered}
        getRowKey={(entry) => entry.id}
        getRowLink={(entry) => entry.detailPath}
        emptyMessage="Nenhuma localidade no ranking filtrado."
        columns={columns}
      />
      <p className="indicadores__source ranking__source">
        Fonte: {ranking.sourceLabel} · referência {ranking.period} · consulta em{' '}
        {formatQueryDate(ranking.queriedAt)} ·{' '}
        <a href={ranking.sourceUrl} target="_blank" rel="noreferrer">
          ver agregado
        </a>
        {ranking.scope === 'municipio' && ranking.ufId != null && (
          <>
            {' · '}
            <Link to={`/estados/${ranking.ufId}`}>
              ver {ranking.ufName ?? 'UF'}
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
