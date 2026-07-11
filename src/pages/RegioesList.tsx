import { getRegioes } from '../api/localidadesService'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import type { Regiao } from '../types/localidades'

export function RegioesList() {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(getRegioes)

  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }

  return (
    <section className="page">
      <h1>Regiões</h1>
      {error && (
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      )}
      <DataList<Regiao>
        items={data ?? []}
        getRowKey={(r) => r.id}
        getRowLink={(r) => `/regioes/${r.id}`}
        emptyMessage="Nenhuma região encontrada."
        columns={[
          { header: 'ID', render: (r) => r.id },
          { header: 'Sigla', render: (r) => r.sigla },
          { header: 'Nome', render: (r) => r.nome },
        ]}
      />
    </section>
  )
}
