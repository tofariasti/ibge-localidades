import { useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getRankingMunicipiosPorUf } from '../api/indicadoresService'
import { getEstado } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { RankingIndicatorToggle } from '../components/RankingIndicatorToggle'
import { RankingTable } from '../components/RankingTable'
import { CopyViewLink } from '../components/CopyViewLink'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { parseRankingIndicator } from '../lib/rankingIndicators'

export function RankingMunicipiosUf() {
  const { ufId } = useParams<{ ufId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const indicator = parseRankingIndicator(searchParams.get('indicador'))

  const estadoQuery = useIbgeQuery(() => getEstado(ufId!), [ufId])
  const rankingQuery = useIbgeQuery(
    () => getRankingMunicipiosPorUf(ufId!, indicator),
    [ufId, indicator],
  )

  const setIndicator = useCallback(
    (key: typeof indicator) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('indicador', key)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  if (!ufId) {
    return <ErrorMessage message="UF não informada." />
  }

  const ufNome = estadoQuery.data?.nome
  const ufSigla = estadoQuery.data?.sigla

  return (
    <section className="page rankings">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Rankings', to: '/rankings' },
          { label: 'Municípios', to: '/rankings/municipios' },
          {
            label: ufSigla ?? ufId,
            to: `/estados/${ufId}`,
          },
        ]}
      />
      <h1>
        Ranking de municípios
        {ufNome ? ` — ${ufNome}` : ''}
        {ufSigla ? ` (${ufSigla})` : ''}
      </h1>
      <p className="page__lead">
        Municípios da UF ordenados do maior para o menor valor do indicador
        (Censo 2022). Clique em uma linha para abrir o detalhe.
      </p>

      <div className="home__toolbar">
        <RankingIndicatorToggle value={indicator} onChange={setIndicator} />
        <CopyViewLink />
      </div>
      {estadoQuery.error && !estadoQuery.data && (
        <ErrorMessage
          message={estadoQuery.error}
          onRetry={estadoQuery.refetch}
          retrying={estadoQuery.refetching}
        />
      )}

      {rankingQuery.loading && <Loading />}
      {rankingQuery.error && !rankingQuery.data && (
        <ErrorMessage
          message={rankingQuery.error}
          onRetry={rankingQuery.refetch}
          retrying={rankingQuery.refetching}
        />
      )}
      {rankingQuery.data && (
        <>
          {rankingQuery.error && (
            <ErrorMessage
              message={rankingQuery.error}
              onRetry={rankingQuery.refetch}
              retrying={rankingQuery.refetching}
            />
          )}
          <p className="ranking__meta" aria-live="polite">
            {rankingQuery.data.variableLabel} ·{' '}
            {rankingQuery.data.entries.length} municípios
          </p>
          <RankingTable
            ranking={{
              ...rankingQuery.data,
              ufName: ufNome ?? rankingQuery.data.ufName,
            }}
            filterId="filtro-ranking-municipios"
          />
        </>
      )}
    </section>
  )
}
