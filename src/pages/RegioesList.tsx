import { useCallback } from 'react'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getRegioes } from '../api/localidadesService'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { Regiao } from '../types/localidades'

export function RegioesList() {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(getRegioes)
  const items = data ?? []
  const getSearchText = useCallback(
    (r: Regiao) => `${r.id} ${r.nome} ${r.sigla}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }

  const apiUrl = buildIbgeApiUrl('/regioes', { orderBy: 'nome' })

  return (
    <section className="page">
      <h1>Regiões</h1>
      {error && (
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      )}
      <ListFilter
        id="filtro-regioes"
        value={filter.query}
        onChange={filter.setQuery}
        shown={filter.shown}
        total={filter.total}
      />
      <ListExportActions<Regiao>
        items={filter.filtered}
        filenameBase="regioes-ibge"
        apiUrl={apiUrl}
        csvColumns={[
          { header: 'id', value: (r) => r.id },
          { header: 'sigla', value: (r) => r.sigla },
          { header: 'nome', value: (r) => r.nome },
        ]}
      />
      <DataList<Regiao>
        items={filter.filtered}
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
