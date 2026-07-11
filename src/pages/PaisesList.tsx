import { useCallback } from 'react'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getPaises } from '../api/localidadesService'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { Pais } from '../types/localidades'

export function PaisesList() {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(getPaises)
  const items = data ?? []
  const getSearchText = useCallback(
    (p: Pais) =>
      `${p.id.M49} ${p.id['ISO-ALPHA-2']} ${p.id['ISO-ALPHA-3']} ${p.nome} ${p['sub-regiao'].nome} ${p['sub-regiao'].regiao.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (loading) return <Loading />
  if (error && !data) {
    return (
      <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
    )
  }

  const apiUrl = buildIbgeApiUrl('/paises', { orderBy: 'nome' })

  return (
    <section className="page">
      <h1>Países</h1>
      <p className="page__lead">
        Divisão internacional de países e áreas segundo a API de Localidades do
        IBGE (códigos M49 e ISO).
      </p>
      {error && (
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      )}
      <ListFilter
        id="filtro-paises"
        value={filter.query}
        onChange={filter.setQuery}
        shown={filter.shown}
        total={filter.total}
        placeholder="Filtrar por nome, ISO ou M49…"
      />
      <ListExportActions<Pais>
        items={filter.filtered}
        filenameBase="paises-ibge"
        apiUrl={apiUrl}
        csvColumns={[
          { header: 'm49', value: (p) => p.id.M49 },
          { header: 'iso_alpha_2', value: (p) => p.id['ISO-ALPHA-2'] },
          { header: 'iso_alpha_3', value: (p) => p.id['ISO-ALPHA-3'] },
          { header: 'nome', value: (p) => p.nome },
          { header: 'sub_regiao', value: (p) => p['sub-regiao'].nome },
          { header: 'regiao', value: (p) => p['sub-regiao'].regiao.nome },
        ]}
      />
      <DataList<Pais>
        items={filter.filtered}
        getRowKey={(p) => p.id.M49}
        getRowLink={(p) => `/paises/${p.id.M49}`}
        emptyMessage="Nenhum país encontrado."
        columns={[
          { header: 'M49', render: (p) => p.id.M49 },
          { header: 'ISO-2', render: (p) => p.id['ISO-ALPHA-2'] },
          { header: 'Nome', render: (p) => p.nome },
          {
            header: 'Região',
            render: (p) => p['sub-regiao'].regiao.nome,
          },
        ]}
      />
    </section>
  )
}
