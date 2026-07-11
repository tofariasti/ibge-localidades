import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import {
  getEstado,
  getRegioesIntermediariasPorUF,
} from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { RegiaoIntermediaria } from '../types/localidades'

export function RegioesIntermediariasList() {
  const { id } = useParams<{ id: string }>()

  const estadoQuery = useIbgeQuery(() => getEstado(id!), [id])
  const listQuery = useIbgeQuery(
    () => getRegioesIntermediariasPorUF(id!),
    [id],
  )
  const items = listQuery.data ?? []
  const getSearchText = useCallback(
    (r: RegiaoIntermediaria) => `${r.id} ${r.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Estado não informado." />

  if (estadoQuery.loading || listQuery.loading) return <Loading />

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
  const apiUrl = buildIbgeApiUrl(
    `/estados/${estado.id}/regioes-intermediarias`,
    { orderBy: 'nome' },
  )

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: estado.nome, to: `/estados/${estado.id}` },
          { label: 'Regiões intermediárias' },
        ]}
      />
      <h1>
        Regiões intermediárias — {estado.nome} ({estado.sigla})
      </h1>

      {listQuery.error && (
        <ErrorMessage
          message={listQuery.error}
          onRetry={listQuery.refetch}
          retrying={listQuery.refetching}
        />
      )}
      {!listQuery.error || listQuery.data ? (
        <>
          <ListFilter
            id="filtro-intermediarias"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<RegiaoIntermediaria>
            items={filter.filtered}
            filenameBase={`regioes-intermediarias-${estado.sigla.toLowerCase()}-ibge`}
            apiUrl={apiUrl}
            csvColumns={[
              { header: 'id', value: (r) => r.id },
              { header: 'nome', value: (r) => r.nome },
              { header: 'uf_id', value: () => estado.id },
              { header: 'uf', value: () => estado.sigla },
            ]}
          />
          <DataList<RegiaoIntermediaria>
            items={filter.filtered}
            getRowKey={(r) => r.id}
            getRowLink={(r) => `/regioes-intermediarias/${r.id}`}
            emptyMessage="Nenhuma região intermediária encontrada."
            columns={[
              { header: 'ID', render: (r) => r.id },
              { header: 'Nome', render: (r) => r.nome },
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
