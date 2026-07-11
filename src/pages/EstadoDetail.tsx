import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstado } from '../api/localidadesService'
import { BrazilMap } from '../components/BrazilMap'
import { Breadcrumb } from '../components/Breadcrumb'
import { DetailActions } from '../components/DetailActions'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
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

      <DetailActions
        code={data.id}
        resource={data}
        apiUrl={buildIbgeApiUrl(`/estados/${data.id}`)}
      />

      <p className="action-bar__buttons">
        <Link to={`/estados/${data.id}/municipios`} className="button">
          Ver municípios
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
      </p>
      <p>
        <Link to="/estados">← Voltar para estados</Link>
      </p>
    </section>
  )
}
