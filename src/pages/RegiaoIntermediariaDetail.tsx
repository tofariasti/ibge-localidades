import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import {
  getRegiaoIntermediaria,
  getRegioesImediatasPorIntermediaria,
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
import type { RegiaoImediata } from '../types/localidades'

export function RegiaoIntermediariaDetail() {
  const { id } = useParams<{ id: string }>()

  const interQuery = useIbgeQuery(() => getRegiaoIntermediaria(id!), [id])
  const imediatasQuery = useIbgeQuery(
    () => getRegioesImediatasPorIntermediaria(id!),
    [id],
  )
  const items = imediatasQuery.data ?? []
  const getSearchText = useCallback(
    (r: RegiaoImediata) => `${r.id} ${r.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Região intermediária não informada." />

  if (interQuery.loading) return <Loading />

  if (interQuery.error && !interQuery.data) {
    return (
      <ErrorMessage
        message={interQuery.error}
        onRetry={interQuery.refetch}
        retrying={interQuery.refetching}
      />
    )
  }

  if (!interQuery.data) {
    return <EmptyState message="Região intermediária não encontrada." />
  }

  const inter = interQuery.data
  const uf = inter.UF
  const apiUrl = buildIbgeApiUrl(`/regioes-intermediarias/${inter.id}`)
  const imediatasApiUrl = buildIbgeApiUrl(
    `/regioes-intermediarias/${inter.id}/regioes-imediatas`,
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
            label: 'Regiões intermediárias',
            to: `/estados/${uf.id}/regioes-intermediarias`,
          },
          { label: inter.nome },
        ]}
      />
      <h1>{inter.nome}</h1>

      <dl className="detail">
        <dt>ID</dt>
        <dd>{inter.id}</dd>
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

      <DetailActions code={inter.id} resource={inter} apiUrl={apiUrl} />

      <h2>Regiões imediatas</h2>
      {imediatasQuery.loading && <Loading />}
      {imediatasQuery.error && (
        <ErrorMessage
          message={imediatasQuery.error}
          onRetry={imediatasQuery.refetch}
          retrying={imediatasQuery.refetching}
        />
      )}
      {!imediatasQuery.loading &&
      (!imediatasQuery.error || imediatasQuery.data) ? (
        <>
          <ListFilter
            id="filtro-imediatas-inter"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<RegiaoImediata>
            items={filter.filtered}
            filenameBase={`regioes-imediatas-inter-${inter.id}-ibge`}
            apiUrl={imediatasApiUrl}
            csvColumns={[
              { header: 'id', value: (r) => r.id },
              { header: 'nome', value: (r) => r.nome },
              { header: 'intermediaria_id', value: () => inter.id },
              { header: 'intermediaria', value: () => inter.nome },
            ]}
          />
          <DataList<RegiaoImediata>
            items={filter.filtered}
            getRowKey={(r) => r.id}
            getRowLink={(r) => `/regioes-imediatas/${r.id}`}
            emptyMessage="Nenhuma região imediata nesta intermediária."
            columns={[
              { header: 'ID', render: (r) => r.id },
              { header: 'Nome', render: (r) => r.nome },
            ]}
          />
        </>
      ) : null}

      <p>
        <Link to={`/estados/${uf.id}/regioes-intermediarias`}>
          ← Voltar para intermediárias de {uf.sigla}
        </Link>
      </p>
    </section>
  )
}
