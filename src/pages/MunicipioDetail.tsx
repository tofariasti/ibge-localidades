import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getMunicipio } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DetailActions } from '../components/DetailActions'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import type { Municipio, UF } from '../types/localidades'

function getUfFromMunicipio(municipio: Municipio): UF | null {
  if (municipio.microrregiao?.mesorregiao?.UF) {
    return municipio.microrregiao.mesorregiao.UF
  }
  if (municipio['regiao-imediata']?.['regiao-intermediaria']?.UF) {
    return municipio['regiao-imediata']['regiao-intermediaria'].UF
  }
  return null
}

export function MunicipioDetail() {
  const { id } = useParams<{ id: string }>()
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
  const microrregiao = data.microrregiao
  const mesorregiao = microrregiao?.mesorregiao

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          ...(uf
            ? [
                { label: uf.nome, to: `/estados/${uf.id}` },
                ...(mesorregiao
                  ? [
                      {
                        label: 'Mesorregiões',
                        to: `/estados/${uf.id}/mesorregioes`,
                      },
                      {
                        label: mesorregiao.nome,
                        to: `/mesorregioes/${mesorregiao.id}`,
                      },
                    ]
                  : []),
                ...(microrregiao
                  ? [
                      {
                        label: microrregiao.nome,
                        to: `/microrregioes/${microrregiao.id}`,
                      },
                    ]
                  : mesorregiao
                    ? []
                    : [
                        {
                          label: 'Municípios',
                          to: `/estados/${uf.id}/municipios`,
                        },
                      ]),
              ]
            : []),
          { label: data.nome },
        ]}
      />
      <h1>{data.nome}</h1>
      <dl className="detail">
        <dt>ID</dt>
        <dd>{data.id}</dd>
        {uf && (
          <>
            <dt>UF</dt>
            <dd>
              <Link to={`/estados/${uf.id}`}>
                {uf.nome} ({uf.sigla})
              </Link>
            </dd>
            <dt>Região</dt>
            <dd>
              <Link to={`/regioes/${uf.regiao.id}`}>
                {uf.regiao.nome} ({uf.regiao.sigla})
              </Link>
            </dd>
          </>
        )}
        {microrregiao && (
          <>
            <dt>Microrregião</dt>
            <dd>
              <Link to={`/microrregioes/${microrregiao.id}`}>
                {microrregiao.nome}
              </Link>
            </dd>
            <dt>Mesorregião</dt>
            <dd>
              <Link to={`/mesorregioes/${microrregiao.mesorregiao.id}`}>
                {microrregiao.mesorregiao.nome}
              </Link>
            </dd>
          </>
        )}
        {data['regiao-imediata'] && (
          <>
            <dt>Região imediata</dt>
            <dd>{data['regiao-imediata'].nome}</dd>
            <dt>Região intermediária</dt>
            <dd>{data['regiao-imediata']['regiao-intermediaria'].nome}</dd>
          </>
        )}
      </dl>

      <DetailActions
        code={data.id}
        resource={data}
        apiUrl={buildIbgeApiUrl(`/municipios/${data.id}`)}
      />

      {uf && (
        <p>
          <Link to={`/estados/${uf.id}/municipios`}>
            ← Voltar para municípios de {uf.sigla}
          </Link>
        </p>
      )}
    </section>
  )
}
