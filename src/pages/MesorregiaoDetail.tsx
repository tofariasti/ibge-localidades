import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import {
  getMesorregiao,
  getMicrorregioesPorMesorregiao,
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
import type { Microrregiao } from '../types/localidades'

export function MesorregiaoDetail() {
  const { id } = useParams<{ id: string }>()

  const mesoQuery = useIbgeQuery(() => getMesorregiao(id!), [id])
  const microsQuery = useIbgeQuery(
    () => getMicrorregioesPorMesorregiao(id!),
    [id],
  )
  const items = microsQuery.data ?? []
  const getSearchText = useCallback(
    (m: Microrregiao) => `${m.id} ${m.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Mesorregião não informada." />

  if (mesoQuery.loading) return <Loading />

  if (mesoQuery.error && !mesoQuery.data) {
    return (
      <ErrorMessage
        message={mesoQuery.error}
        onRetry={mesoQuery.refetch}
        retrying={mesoQuery.refetching}
      />
    )
  }

  if (!mesoQuery.data) {
    return <EmptyState message="Mesorregião não encontrada." />
  }

  const meso = mesoQuery.data
  const uf = meso.UF
  const apiUrl = buildIbgeApiUrl(`/mesorregioes/${meso.id}`)
  const microsApiUrl = buildIbgeApiUrl(
    `/mesorregioes/${meso.id}/microrregioes`,
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
          { label: meso.nome },
        ]}
      />
      <h1>{meso.nome}</h1>

      <dl className="detail">
        <dt>ID</dt>
        <dd>{meso.id}</dd>
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

      <DetailActions code={meso.id} resource={meso} apiUrl={apiUrl} />

      <h2>Microrregiões</h2>
      {microsQuery.loading && <Loading />}
      {microsQuery.error && (
        <ErrorMessage
          message={microsQuery.error}
          onRetry={microsQuery.refetch}
          retrying={microsQuery.refetching}
        />
      )}
      {!microsQuery.loading && (!microsQuery.error || microsQuery.data) ? (
        <>
          <ListFilter
            id="filtro-microrregioes-meso"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<Microrregiao>
            items={filter.filtered}
            filenameBase={`microrregioes-meso-${meso.id}-ibge`}
            apiUrl={microsApiUrl}
            csvColumns={[
              { header: 'id', value: (m) => m.id },
              { header: 'nome', value: (m) => m.nome },
              { header: 'mesorregiao_id', value: () => meso.id },
              { header: 'mesorregiao', value: () => meso.nome },
            ]}
          />
          <DataList<Microrregiao>
            items={filter.filtered}
            getRowKey={(m) => m.id}
            getRowLink={(m) => `/microrregioes/${m.id}`}
            emptyMessage="Nenhuma microrregião nesta mesorregião."
            columns={[
              { header: 'ID', render: (m) => m.id },
              { header: 'Nome', render: (m) => m.nome },
            ]}
          />
        </>
      ) : null}

      <p>
        <Link to={`/estados/${uf.id}/mesorregioes`}>
          ← Voltar para mesorregiões de {uf.sigla}
        </Link>
      </p>
    </section>
  )
}
