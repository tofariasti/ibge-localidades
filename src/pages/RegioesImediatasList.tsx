import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import {
  getEstado,
  getRegioesImediatasPorUF,
} from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { RegiaoImediata } from '../types/localidades'

export function RegioesImediatasList() {
  const { id } = useParams<{ id: string }>()

  const estadoQuery = useIbgeQuery(() => getEstado(id!), [id])
  const listQuery = useIbgeQuery(() => getRegioesImediatasPorUF(id!), [id])
  const items = listQuery.data ?? []
  const getSearchText = useCallback(
    (r: RegiaoImediata) =>
      `${r.id} ${r.nome} ${r['regiao-intermediaria'].id} ${r['regiao-intermediaria'].nome}`,
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
  const apiUrl = buildIbgeApiUrl(`/estados/${estado.id}/regioes-imediatas`, {
    orderBy: 'nome',
  })

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: estado.nome, to: `/estados/${estado.id}` },
          { label: 'Regiões imediatas' },
        ]}
      />
      <h1>
        Regiões imediatas — {estado.nome} ({estado.sigla})
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
            id="filtro-imediatas"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<RegiaoImediata>
            items={filter.filtered}
            filenameBase={`regioes-imediatas-${estado.sigla.toLowerCase()}-ibge`}
            apiUrl={apiUrl}
            csvColumns={[
              { header: 'id', value: (r) => r.id },
              { header: 'nome', value: (r) => r.nome },
              {
                header: 'intermediaria_id',
                value: (r) => r['regiao-intermediaria'].id,
              },
              {
                header: 'intermediaria',
                value: (r) => r['regiao-intermediaria'].nome,
              },
              { header: 'uf', value: () => estado.sigla },
            ]}
          />
          <DataList<RegiaoImediata>
            items={filter.filtered}
            getRowKey={(r) => r.id}
            getRowLink={(r) => `/regioes-imediatas/${r.id}`}
            emptyMessage="Nenhuma região imediata encontrada."
            columns={[
              { header: 'ID', render: (r) => r.id },
              { header: 'Nome', render: (r) => r.nome },
              {
                header: 'Intermediária',
                render: (r) => (
                  <Link
                    to={`/regioes-intermediarias/${r['regiao-intermediaria'].id}`}
                  >
                    {r['regiao-intermediaria'].nome}
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
