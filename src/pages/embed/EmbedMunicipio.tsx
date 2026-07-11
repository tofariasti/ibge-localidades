import { Link, useParams } from 'react-router-dom'
import { getMunicipio } from '../../api/localidadesService'
import { EmptyState } from '../../components/EmptyState'
import { ErrorMessage } from '../../components/ErrorMessage'
import { Loading } from '../../components/Loading'
import { useEmbedPath } from '../../hooks/useEmbedBrand'
import { useIbgeQuery } from '../../hooks/useIbgeQuery'
import { fullAppHref } from '../../lib/embedBrand'
import type { Municipio, UF } from '../../types/localidades'

function getUfFromMunicipio(municipio: Municipio): UF | null {
  if (municipio.microrregiao?.mesorregiao?.UF) {
    return municipio.microrregiao.mesorregiao.UF
  }
  if (municipio['regiao-imediata']?.['regiao-intermediaria']?.UF) {
    return municipio['regiao-imediata']['regiao-intermediaria'].UF
  }
  return null
}

export function EmbedMunicipio() {
  const { id } = useParams<{ id: string }>()
  const embedPath = useEmbedPath()
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () => getMunicipio(id!),
    [id],
  )

  if (!id) return <ErrorMessage message="Município não informado." />
  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }
  if (!data) return <EmptyState message="Município não encontrado." />

  const uf = getUfFromMunicipio(data)

  return (
    <section className="page embed-page">
      <p className="embed-page__nav">
        <Link to={embedPath('/embed')}>← Mapa</Link>
        {uf ? (
          <>
            {' · '}
            <Link to={embedPath(`/embed/estados/${uf.id}`)}>
              {uf.sigla}
            </Link>
          </>
        ) : null}
      </p>
      <h1 className="embed-page__title">{data.nome}</h1>

      <dl className="detail">
        <dt>Código IBGE</dt>
        <dd>{data.id}</dd>
        {uf && (
          <>
            <dt>UF</dt>
            <dd>
              <Link to={embedPath(`/embed/estados/${uf.id}`)}>
                {uf.nome} ({uf.sigla})
              </Link>
            </dd>
            <dt>Região</dt>
            <dd>
              <Link to={embedPath(`/embed/regioes/${uf.regiao.id}`)}>
                {uf.regiao.nome}
              </Link>
            </dd>
          </>
        )}
      </dl>

      <p className="embed-page__actions">
        <a
          className="button"
          href={fullAppHref(`/municipios/${data.id}`)}
          target="_blank"
          rel="noreferrer"
        >
          Abrir no app
        </a>
      </p>
    </section>
  )
}
