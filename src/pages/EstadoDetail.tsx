import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstado } from '../api/localidadesService'
import { BrazilMap } from '../components/BrazilMap'
import { Breadcrumb } from '../components/Breadcrumb'
import { DetailActions } from '../components/DetailActions'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { FavoriteButton } from '../components/FavoriteButton'
import { IndicadoresPanel } from '../components/IndicadoresPanel'
import { Loading } from '../components/Loading'
import { TrackVisit } from '../components/TrackVisit'
import { useIbgeQuery } from '../hooks/useIbgeQuery'

export function EstadoDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () => getEstado(id!),
    [id],
  )

  if (!id) return <ErrorMessage message="Estado não informado." />
  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }
  if (!data) return <EmptyState message="Estado não encontrado." />

  return (
    <section className="page">
      <TrackVisit
        kind="estado"
        id={data.id}
        label={`${data.nome} (${data.sigla})`}
        to={`/estados/${data.id}`}
      />
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: data.regiao.nome, to: `/regioes/${data.regiao.id}` },
          { label: data.nome },
        ]}
      />
      <h1>
        {data.nome} ({data.sigla})
      </h1>

      <p className="action-bar__buttons">
        <FavoriteButton
          kind="estado"
          id={data.id}
          label={`${data.nome} (${data.sigla})`}
          to={`/estados/${data.id}`}
        />
      </p>

      <BrazilMap activeStateId={data.id} />

      <dl className="detail">
        <dt>ID</dt>
        <dd>{data.id}</dd>
        <dt>Sigla</dt>
        <dd>{data.sigla}</dd>
        <dt>Região</dt>
        <dd>
          <Link to={`/regioes/${data.regiao.id}`}>
            {data.regiao.nome} ({data.regiao.sigla})
          </Link>
        </dd>
      </dl>

      <IndicadoresPanel level="estado" id={data.id} />

      <DetailActions
        code={data.id}
        resource={data}
        apiUrl={buildIbgeApiUrl(`/estados/${data.id}`)}
      />

      <p className="action-bar__buttons">
        <Link
          to={`/comparar?ids=${encodeURIComponent(`uf:${data.id}`)}`}
          className="button button--secondary"
        >
          Comparar
        </Link>
        <Link to={`/estados/${data.id}/municipios`} className="button">
          Ver municípios
        </Link>
        <Link
          to={`/rankings/municipios/${data.id}`}
          className="button button--secondary"
        >
          Ranking municípios
        </Link>
        <Link
          to={`/estados/${data.id}/mesorregioes`}
          className="button button--secondary"
        >
          Ver mesorregiões
        </Link>
        <Link
          to={`/estados/${data.id}/microrregioes`}
          className="button button--secondary"
        >
          Ver microrregiões
        </Link>
        <Link
          to={`/estados/${data.id}/regioes-intermediarias`}
          className="button button--secondary"
        >
          Ver intermediárias
        </Link>
        <Link
          to={`/estados/${data.id}/regioes-imediatas`}
          className="button button--secondary"
        >
          Ver imediatas
        </Link>
      </p>
      <p>
        <Link to="/estados">← Voltar para estados</Link>
      </p>
    </section>
  )
}
