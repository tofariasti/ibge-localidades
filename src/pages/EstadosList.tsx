import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstados } from '../api/localidadesService'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { UF } from '../types/localidades'

export function EstadosList() {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(getEstados)
  const items = data ?? []
  const getSearchText = useCallback(
    (uf: UF) => `${uf.id} ${uf.nome} ${uf.sigla} ${uf.regiao.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }

  const apiUrl = buildIbgeApiUrl('/estados', { orderBy: 'nome' })

  return (
    <section className="page">
      <h1>Estados (UF)</h1>
      {error && (
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      )}
      <ListFilter
        id="filtro-estados"
        value={filter.query}
        onChange={filter.setQuery}
        shown={filter.shown}
        total={filter.total}
      />
      <ListExportActions<UF>
        items={filter.filtered}
        filenameBase="estados-ibge"
        apiUrl={apiUrl}
        csvColumns={[
          { header: 'id', value: (uf) => uf.id },
          { header: 'sigla', value: (uf) => uf.sigla },
          { header: 'nome', value: (uf) => uf.nome },
          { header: 'regiao_id', value: (uf) => uf.regiao.id },
          { header: 'regiao', value: (uf) => uf.regiao.nome },
        ]}
      />
      <DataList<UF>
        items={filter.filtered}
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
