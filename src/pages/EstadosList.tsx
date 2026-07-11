import { Link } from 'react-router-dom'
import { getEstados } from '../api/localidadesService'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import type { UF } from '../types/localidades'

export function EstadosList() {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(getEstados)

  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }

  return (
    <section className="page">
      <h1>Estados (UF)</h1>
      {error && (
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      )}
      <DataList<UF>
        items={data ?? []}
        getRowKey={(uf) => uf.id}
        getRowLink={(uf) => `/estados/${uf.id}`}
        emptyMessage="Nenhum estado encontrado."
        columns={[
          { header: 'ID', render: (uf) => uf.id },
          { header: 'Sigla', render: (uf) => uf.sigla },
          { header: 'Nome', render: (uf) => uf.nome },
          {
            header: 'Região',
            render: (uf) => (
              <Link to={`/regioes/${uf.regiao.id}`}>{uf.regiao.nome}</Link>
            ),
          },
        ]}
      />
    </section>
  )
}
