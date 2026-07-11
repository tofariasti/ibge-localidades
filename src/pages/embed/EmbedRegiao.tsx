import { Link, useParams } from 'react-router-dom'
import { getEstadosPorRegiao, getRegiao } from '../../api/localidadesService'
import { BrazilMap } from '../../components/BrazilMap'
import { EmptyState } from '../../components/EmptyState'
import { ErrorMessage } from '../../components/ErrorMessage'
import { Loading } from '../../components/Loading'
import { useEmbedPath } from '../../hooks/useEmbedBrand'
import { useIbgeQuery } from '../../hooks/useIbgeQuery'
import { fullAppHref } from '../../lib/embedBrand'

export function EmbedRegiao() {
  const { id } = useParams<{ id: string }>()
  const embedPath = useEmbedPath()

  const regiaoQuery = useIbgeQuery(() => getRegiao(id!), [id])
  const estadosQuery = useIbgeQuery(() => getEstadosPorRegiao(id!), [id])

  if (!id) return <ErrorMessage message="Região não informada." />
  if (regiaoQuery.loading) return <Loading />
  if (regiaoQuery.error && !regiaoQuery.data) {
    return (
      <ErrorMessage
        message={regiaoQuery.error}
        onRetry={regiaoQuery.refetch}
        retrying={regiaoQuery.refetching}
      />
    )
  }
  if (!regiaoQuery.data) {
    return <EmptyState message="Região não encontrada." />
  }

  const regiao = regiaoQuery.data
  const estados = estadosQuery.data ?? []

  return (
    <section className="page embed-page">
      <p className="embed-page__nav">
        <Link to={embedPath('/embed')}>← Mapa</Link>
      </p>
      <h1 className="embed-page__title">{regiao.nome}</h1>

      <BrazilMap
        highlightRegionId={regiao.id}
        getStatePath={(stateId) => embedPath(`/embed/estados/${stateId}`)}
        getRegionPath={(regionId) => embedPath(`/embed/regioes/${regionId}`)}
      />

      <dl className="detail">
        <dt>ID</dt>
        <dd>{regiao.id}</dd>
        <dt>Sigla</dt>
        <dd>{regiao.sigla}</dd>
      </dl>

      {estadosQuery.error && (
        <ErrorMessage
          message={estadosQuery.error}
          onRetry={estadosQuery.refetch}
          retrying={estadosQuery.refetching}
        />
      )}

      {estados.length > 0 && (
        <>
          <h2 className="embed-page__subtitle">UFs</h2>
          <ul className="embed-page__list">
            {estados.map((uf) => (
              <li key={uf.id}>
                <Link to={embedPath(`/embed/estados/${uf.id}`)}>
                  {uf.nome} ({uf.sigla})
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="embed-page__actions">
        <a
          className="button"
          href={fullAppHref(`/regioes/${regiao.id}`)}
          target="_blank"
          rel="noreferrer"
        >
          Abrir no app
        </a>
      </p>
    </section>
  )
}
