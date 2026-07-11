import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstado, getMicrorregioesPorUF } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { Microrregiao } from '../types/localidades'

export function MicrorregioesList() {
  const { id } = useParams<{ id: string }>()

  const estadoQuery = useIbgeQuery(() => getEstado(id!), [id])
  const microsQuery = useIbgeQuery(() => getMicrorregioesPorUF(id!), [id])
  const items = microsQuery.data ?? []
  const getSearchText = useCallback(
    (m: Microrregiao) =>
      `${m.id} ${m.nome} ${m.mesorregiao.id} ${m.mesorregiao.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Estado não informado." />

  if (estadoQuery.loading || microsQuery.loading) return <Loading />

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
  const apiUrl = buildIbgeApiUrl(`/estados/${estado.id}/microrregioes`, {
    orderBy: 'nome',
  })

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: estado.nome, to: `/estados/${estado.id}` },
          { label: 'Microrregiões' },
        ]}
      />
      <h1>
        Microrregiões — {estado.nome} ({estado.sigla})
      </h1>

      {microsQuery.error && (
        <ErrorMessage
          message={microsQuery.error}
          onRetry={microsQuery.refetch}
          retrying={microsQuery.refetching}
        />
      )}
      {!microsQuery.error || microsQuery.data ? (
        <>
          <ListFilter
            id="filtro-microrregioes"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<Microrregiao>
            items={filter.filtered}
            filenameBase={`microrregioes-${estado.sigla.toLowerCase()}-ibge`}
            apiUrl={apiUrl}
            csvColumns={[
              { header: 'id', value: (m) => m.id },
              { header: 'nome', value: (m) => m.nome },
              { header: 'mesorregiao_id', value: (m) => m.mesorregiao.id },
              { header: 'mesorregiao', value: (m) => m.mesorregiao.nome },
              { header: 'uf', value: () => estado.sigla },
            ]}
          />
          <DataList<Microrregiao>
            items={filter.filtered}
            getRowKey={(m) => m.id}
            getRowLink={(m) => `/microrregioes/${m.id}`}
            emptyMessage="Nenhuma microrregião encontrada."
            columns={[
              { header: 'ID', render: (m) => m.id },
              { header: 'Nome', render: (m) => m.nome },
              {
                header: 'Mesorregião',
                render: (m) => (
                  <Link to={`/mesorregioes/${m.mesorregiao.id}`}>
                    {m.mesorregiao.nome}
                  </Link>
                ),
              },
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
