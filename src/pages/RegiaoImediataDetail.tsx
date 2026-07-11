import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import {
  getMunicipiosPorRegiaoImediata,
  getRegiaoImediata,
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

export function RegiaoImediataDetail() {
  const { id } = useParams<{ id: string }>()

  const imediataQuery = useIbgeQuery(() => getRegiaoImediata(id!), [id])
  const municipiosQuery = useIbgeQuery(
    () => getMunicipiosPorRegiaoImediata(id!),
    [id],
  )
  const items = municipiosQuery.data ?? []
  const getSearchText = useCallback(
    (m: Municipio) => `${m.id} ${m.nome}`,
    [],
  )
  const filter = useLocalFilter(items, getSearchText)

  if (!id) return <ErrorMessage message="Região imediata não informada." />

  if (imediataQuery.loading) return <Loading />

  if (imediataQuery.error && !imediataQuery.data) {
    return (
      <ErrorMessage
        message={imediataQuery.error}
        onRetry={imediataQuery.refetch}
        retrying={imediataQuery.refetching}
      />
    )
  }

  if (!imediataQuery.data) {
    return <EmptyState message="Região imediata não encontrada." />
  }

  const imediata = imediataQuery.data
  const inter = imediata['regiao-intermediaria']
  const uf = inter.UF
  const apiUrl = buildIbgeApiUrl(`/regioes-imediatas/${imediata.id}`)
  const municipiosApiUrl = buildIbgeApiUrl(
    `/regioes-imediatas/${imediata.id}/municipios`,
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
          {
            label: inter.nome,
            to: `/regioes-intermediarias/${inter.id}`,
          },
          { label: imediata.nome },
        ]}
      />
      <h1>{imediata.nome}</h1>

      <dl className="detail">
        <dt>ID</dt>
        <dd>{imediata.id}</dd>
        <dt>Região intermediária</dt>
        <dd>
          <Link to={`/regioes-intermediarias/${inter.id}`}>{inter.nome}</Link>
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

      <DetailActions code={imediata.id} resource={imediata} apiUrl={apiUrl} />

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
            id="filtro-municipios-imediata"
            value={filter.query}
            onChange={filter.setQuery}
            shown={filter.shown}
            total={filter.total}
          />
          <ListExportActions<Municipio>
            items={filter.filtered}
            filenameBase={`municipios-imediata-${imediata.id}-ibge`}
            apiUrl={municipiosApiUrl}
            csvColumns={[
              { header: 'id', value: (m) => m.id },
              { header: 'nome', value: (m) => m.nome },
              { header: 'imediata_id', value: () => imediata.id },
              { header: 'imediata', value: () => imediata.nome },
            ]}
          />
          <DataList<Municipio>
            items={filter.filtered}
            getRowKey={(m) => m.id}
            getRowLink={(m) => `/municipios/${m.id}`}
            emptyMessage="Nenhum município nesta região imediata."
            columns={[
              { header: 'ID', render: (m) => m.id },
              { header: 'Nome', render: (m) => m.nome },
            ]}
          />
        </>
      ) : null}

      <p>
        <Link to={`/regioes-intermediarias/${inter.id}`}>
          ← Voltar para {inter.nome}
        </Link>
      </p>
    </section>
  )
}
