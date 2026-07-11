import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getPais } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DetailActions } from '../components/DetailActions'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'

export function PaisDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () => getPais(id!),
    [id],
  )

  if (!id) return <ErrorMessage message="País não informado." />
  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }
  if (!data) return <EmptyState message="País não encontrado." />

  const sub = data['sub-regiao']
  const inter = data['regiao-intermediaria']
  const isBrasil = data.id.M49 === 76

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Países', to: '/paises' },
          { label: data.nome },
        ]}
      />
      <h1>{data.nome}</h1>

      <dl className="detail">
        <dt>M49</dt>
        <dd>{data.id.M49}</dd>
        <dt>ISO-ALPHA-2</dt>
        <dd>{data.id['ISO-ALPHA-2']}</dd>
        <dt>ISO-ALPHA-3</dt>
        <dd>{data.id['ISO-ALPHA-3']}</dd>
        <dt>Sub-região</dt>
        <dd>{sub.nome}</dd>
        <dt>Região</dt>
        <dd>{sub.regiao.nome}</dd>
        {inter && (
          <>
            <dt>Região intermediária</dt>
            <dd>{inter.nome}</dd>
          </>
        )}
      </dl>

      <DetailActions
        code={data.id.M49}
        resource={data}
        apiUrl={buildIbgeApiUrl(`/paises/${data.id.M49}`)}
      />

      {isBrasil && (
        <p className="action-bar__buttons">
          <Link to="/regioes" className="button">
            Explorar regiões do Brasil
          </Link>
          <Link to="/estados" className="button button--secondary">
            Ver estados
          </Link>
        </p>
      )}

      <p>
        <Link to="/paises">← Voltar para países</Link>
      </p>
    </section>
  )
}
