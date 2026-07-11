import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import {
  getMicrorregiao,
  getMunicipiosPorMicrorregiao,
} from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { DetailActions } from '../components/DetailActions'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListExportActions } from '../components/ListExportActions'
import { ListFilter } from '../components/ListFilter'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useLocalFilter } from '../hooks/useLocalFilter'
import type { Municipio } from '../types/localidades'

export function MicrorregiaoDetail() {
  const { id } = useParams<{ id: string }>()

  const microQuery = useIbgeQuery(() => getMicrorregiao(id!), [id])
  const municipiosQuery = useIbgeQuery(
    () => getMunicipiosPorMicrorregiao(id!),
    [id],
  )
  const items = municipiosQuery.data ?? []
  const getSearchText = useCallback(
    (m: Municipio) => `${m.id} ${m.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Microrregião não informada." />

  if (microQuery.loading) return <Loading />

  if (microQuery.error && !microQuery.data) {
    return (
      <ErrorMessage
        message={microQuery.error}
        onRetry={microQuery.refetch}
        retrying={microQuery.refetching}
      />
    )
  }

  if (!microQuery.data) {
    return <EmptyState message="Microrregião não encontrada." />
  }

  const micro = microQuery.data
  const meso = micro.mesorregiao
  const uf = meso.UF
  const apiUrl = buildIbgeApiUrl(`/microrregioes/${micro.id}`)
  const municipiosApiUrl = buildIbgeApiUrl(
    `/microrregioes/${micro.id}/municipios`,
    { orderBy: 'nome' },
  )

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: uf.nome, to: `/estados/${uf.id}` },
          {
            label: 'Mesorregiões',
            to: `/estados/${uf.id}/mesorregioes`,
          },
          { label: meso.nome, to: `/mesorregioes/${meso.id}` },
          { label: micro.nome },
        ]}
      />
      <h1>{micro.nome}</h1>

      <dl className="detail">
        <dt>ID</dt>
        <dd>{micro.id}</dd>
        <dt>Mesorregião</dt>
        <dd>
          <Link to={`/mesorregioes/${meso.id}`}>{meso.nome}</Link>
        </dd>
        <dt>UF</dt>
        <dd>
          <Link to={`/estados/${uf.id}`}>
            {uf.nome} ({uf.sigla})
          </Link>
        </dd>
        <dt>Região</dt>
        <dd>
          <Link to={`/regioes/${uf.regiao.id}`}>
            {uf.regiao.nome} ({uf.regiao.sigla})
          </Link>
        </dd>
      </dl>

      <DetailActions code={micro.id} resource={micro} apiUrl={apiUrl} />

      <h2>Municípios</h2>
      {municipiosQuery.loading && <Loading />}
      {municipiosQuery.error && (
        <ErrorMessage
          message={municipiosQuery.error}
          onRetry={municipiosQuery.refetch}
          retrying={municipiosQuery.refetching}
        />
      )}
      {!municipiosQuery.loading &&
      (!municipiosQuery.error || municipiosQuery.data) ? (
        <>
          <ListFilter
            id="filtro-municipios-micro"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<Municipio>
            items={filter.filtered}
            filenameBase={`municipios-micro-${micro.id}-ibge`}
            apiUrl={municipiosApiUrl}
            csvColumns={[
              { header: 'id', value: (m) => m.id },
              { header: 'nome', value: (m) => m.nome },
              { header: 'microrregiao_id', value: () => micro.id },
              { header: 'microrregiao', value: () => micro.nome },
            ]}
          />
          <DataList<Municipio>
            items={filter.filtered}
            getRowKey={(m) => m.id}
            getRowLink={(m) => `/municipios/${m.id}`}
            emptyMessage="Nenhum município nesta microrregião."
            columns={[
              { header: 'ID', render: (m) => m.id },
              { header: 'Nome', render: (m) => m.nome },
            ]}
          />
        </>
      ) : null}

      <p>
        <Link to={`/mesorregioes/${meso.id}`}>
          ← Voltar para {meso.nome}
        </Link>
      </p>
    </section>
  )
}
