import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getRankingUfs } from '../api/indicadoresService'
import { Breadcrumb } from '../components/Breadcrumb'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { RankingIndicatorToggle } from '../components/RankingIndicatorToggle'
import { RankingTable } from '../components/RankingTable'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { parseRankingIndicator } from '../lib/rankingIndicators'

export function RankingUfs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const indicator = parseRankingIndicator(searchParams.get('indicador'))

  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () => getRankingUfs(indicator),
    [indicator],
  )

  const setIndicator = useCallback(
    (key: typeof indicator) => {
      setSearchParams({ indicador: key }, { replace: true })
    },
    [setSearchParams],
  )

  return (
    <section className="page rankings">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Rankings', to: '/rankings' },
          { label: 'UFs' },
        ]}
      />
      <h1>Ranking de UFs</h1>
      <p className="page__lead">
        Unidades federativas ordenadas do maior para o menor valor do indicador
        (Censo 2022). Clique em uma linha para abrir o detalhe.
      </p>

      <RankingIndicatorToggle value={indicator} onChange={setIndicator} />

      {loading && <Loading />}
      {error && !data && (
        <ErrorMessage
          message={error}
          onRetry={refetch}
          retrying={refetching}
        />
      )}
      {data && (
        <>
          {error && (
            <ErrorMessage
              message={error}
              onRetry={refetch}
              retrying={refetching}
            />
          )}
          <p className="ranking__meta" aria-live="polite">
            {data.variableLabel} · {data.entries.length} UFs
          </p>
          <RankingTable ranking={data} filterId="filtro-ranking-ufs" />
        </>
      )}
    </section>
  )
}
