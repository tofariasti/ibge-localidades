import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstado, getMesorregioesPorUF } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { Mesorregiao } from '../types/localidades'

export function MesorregioesList() {
  const { id } = useParams<{ id: string }>()

  const estadoQuery = useIbgeQuery(() => getEstado(id!), [id])
  const mesosQuery = useIbgeQuery(() => getMesorregioesPorUF(id!), [id])
  const items = mesosQuery.data ?? []
  const getSearchText = useCallback(
    (m: Mesorregiao) => `${m.id} ${m.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Estado não informado." />

  if (estadoQuery.loading || mesosQuery.loading) return <Loading />

  if (estadoQuery.error && !estadoQuery.data) {
    return (
      <ErrorMessage
        message={estadoQuery.error}
        onRetry={estadoQuery.refetch}
        retrying={estadoQuery.refetching}
      />
    )
  }

  const estado = estadoQuery.data!
  const apiUrl = buildIbgeApiUrl(`/estados/${estado.id}/mesorregioes`, {
    orderBy: 'nome',
  })

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: estado.nome, to: `/estados/${estado.id}` },
          { label: 'Mesorregiões' },
        ]}
      />
      <h1>
        Mesorregiões — {estado.nome} ({estado.sigla})
      </h1>

      {mesosQuery.error && (
        <ErrorMessage
          message={mesosQuery.error}
          onRetry={mesosQuery.refetch}
          retrying={mesosQuery.refetching}
        />
      )}
      {!mesosQuery.error || mesosQuery.data ? (
        <>
          <ListFilter
            id="filtro-mesorregioes"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<Mesorregiao>
            items={filter.filtered}
            filenameBase={`mesorregioes-${estado.sigla.toLowerCase()}-ibge`}
            apiUrl={apiUrl}
            csvColumns={[
              { header: 'id', value: (m) => m.id },
              { header: 'nome', value: (m) => m.nome },
              { header: 'uf_id', value: () => estado.id },
              { header: 'uf', value: () => estado.sigla },
            ]}
          />
          <DataList<Mesorregiao>
            items={filter.filtered}
            getRowKey={(m) => m.id}
            getRowLink={(m) => `/mesorregioes/${m.id}`}
            emptyMessage="Nenhuma mesorregião encontrada."
            columns={[
              { header: 'ID', render: (m) => m.id },
              { header: 'Nome', render: (m) => m.nome },
            ]}
          />
        </>
      ) : null}

      <p>
        <Link to={`/estados/${estado.id}`}>← Voltar para {estado.sigla}</Link>
      </p>
    </section>
  )
}
