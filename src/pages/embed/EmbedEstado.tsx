import { Link, useParams } from 'react-router-dom'
import { getEstado } from '../../api/localidadesService'
import { BrazilMap } from '../../components/BrazilMap'
import { EmptyState } from '../../components/EmptyState'
import { ErrorMessage } from '../../components/ErrorMessage'
import { Loading } from '../../components/Loading'
import { useEmbedPath } from '../../hooks/useEmbedBrand'
import { useIbgeQuery } from '../../hooks/useIbgeQuery'
import { fullAppHref } from '../../lib/embedBrand'

export function EmbedEstado() {
  const { id } = useParams<{ id: string }>()
  const embedPath = useEmbedPath()
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
    <section className="page embed-page">
      <p className="embed-page__nav">
        <Link to={embedPath('/embed')}>← Mapa</Link>
      </p>
      <h1 className="embed-page__title">
        {data.nome} ({data.sigla})
      </h1>

      <BrazilMap
        activeStateId={data.id}
        getStatePath={(stateId) => embedPath(`/embed/estados/${stateId}`)}
        getRegionPath={(regionId) => embedPath(`/embed/regioes/${regionId}`)}
      />

      <dl className="detail">
        <dt>ID</dt>
        <dd>{data.id}</dd>
        <dt>Região</dt>
        <dd>
          <Link to={embedPath(`/embed/regioes/${data.regiao.id}`)}>
            {data.regiao.nome} ({data.regiao.sigla})
          </Link>
        </dd>
      </dl>

      <p className="embed-page__actions">
        <a
          className="button"
          href={fullAppHref(`/estados/${data.id}`)}
          target="_blank"
          rel="noreferrer"
        >
          Abrir no app
        </a>
      </p>
    </section>
  )
}
