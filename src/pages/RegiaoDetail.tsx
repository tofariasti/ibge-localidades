import { Link, useParams } from 'react-router-dom'
import { getEstadosPorRegiao, getRegiao } from '../api/localidadesService'
import { BrazilMap } from '../components/BrazilMap'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import type { UF } from '../types/localidades'

export function RegiaoDetail() {
  const { id } = useParams<{ id: string }>()

  const regiaoQuery = useIbgeQuery(() => getRegiao(id!), [id])
  const estadosQuery = useIbgeQuery(() => getEstadosPorRegiao(id!), [id])

  if (!id) return <ErrorMessage message="Região não informada." />

  if (regiaoQuery.loading || estadosQuery.loading) return <Loading />

  if (regiaoQuery.error) {
    return <ErrorMessage message={regiaoQuery.error} onRetry={regiaoQuery.refetch} />
  }

  const regiao = regiaoQuery.data!

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Regiões', to: '/regioes' },
          { label: regiao.nome },
        ]}
      />
      <h1>{regiao.nome}</h1>

      <BrazilMap highlightRegionId={regiao.id} />

      <dl className="detail">
        <dt>ID</dt>
        <dd>{regiao.id}</dd>
        <dt>Sigla</dt>
        <dd>{regiao.sigla}</dd>
      </dl>

      <h2>Unidades Federativas</h2>
      {estadosQuery.error ? (
        <ErrorMessage message={estadosQuery.error} onRetry={estadosQuery.refetch} />
      ) : estadosQuery.data?.length ? (
        <DataList<UF>
          items={estadosQuery.data}
          getRowKey={(uf) => uf.id}
          getRowLink={(uf) => `/estados/${uf.id}`}
          columns={[
            { header: 'ID', render: (uf) => uf.id },
            { header: 'Sigla', render: (uf) => uf.sigla },
            { header: 'Nome', render: (uf) => uf.nome },
          ]}
        />
      ) : (
        <p>Nenhum estado nesta região.</p>
      )}

      <p>
        <Link to="/regioes">← Voltar para regiões</Link>
      </p>
    </section>
  )
}
