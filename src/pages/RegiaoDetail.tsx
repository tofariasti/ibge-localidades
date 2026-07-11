import { Link, useParams } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstadosPorRegiao, getRegiao } from '../api/localidadesService'
import { BrazilMap } from '../components/BrazilMap'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { DetailActions } from '../components/DetailActions'
import { ErrorMessage } from '../components/ErrorMessage'
import { FavoriteButton } from '../components/FavoriteButton'
import { Loading } from '../components/Loading'
import { TrackVisit } from '../components/TrackVisit'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import type { UF } from '../types/localidades'

export function RegiaoDetail() {
  const { id } = useParams<{ id: string }>()

  const regiaoQuery = useIbgeQuery(() => getRegiao(id!), [id])
  const estadosQuery = useIbgeQuery(() => getEstadosPorRegiao(id!), [id])

  if (!id) return <ErrorMessage message="Região não informada." />

  if (regiaoQuery.loading || estadosQuery.loading) return <Loading />

  if (regiaoQuery.error && !regiaoQuery.data) {
    return (
      <ErrorMessage
        message={regiaoQuery.error}
        onRetry={regiaoQuery.refetch}
        retrying={regiaoQuery.refetching}
      />
    )
  }

  const regiao = regiaoQuery.data!

  return (
    <section className="page">
      <TrackVisit
        kind="regiao"
        id={regiao.id}
        label={regiao.nome}
        to={`/regioes/${regiao.id}`}
      />
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Regiões', to: '/regioes' },
          { label: regiao.nome },
        ]}
      />
      <h1>{regiao.nome}</h1>

      <p className="action-bar__buttons">
        <FavoriteButton
          kind="regiao"
          id={regiao.id}
          label={regiao.nome}
          to={`/regioes/${regiao.id}`}
        />
      </p>

      <BrazilMap highlightRegionId={regiao.id} />

      <dl className="detail">
        <dt>ID</dt>
        <dd>{regiao.id}</dd>
        <dt>Sigla</dt>
        <dd>{regiao.sigla}</dd>
      </dl>

      <DetailActions
        code={regiao.id}
        resource={regiao}
        apiUrl={buildIbgeApiUrl(`/regioes/${regiao.id}`)}
      />

      <h2>Unidades Federativas</h2>
      {estadosQuery.error && (
        <ErrorMessage
          message={estadosQuery.error}
          onRetry={estadosQuery.refetch}
          retrying={estadosQuery.refetching}
        />
      )}
      {(!estadosQuery.error || estadosQuery.data) && (
        <DataList<UF>
          items={estadosQuery.data ?? []}
          getRowKey={(uf) => uf.id}
          getRowLink={(uf) => `/estados/${uf.id}`}
          emptyMessage="Nenhum estado nesta região."
          columns={[
            { header: 'ID', render: (uf) => uf.id },
            { header: 'Sigla', render: (uf) => uf.sigla },
            { header: 'Nome', render: (uf) => uf.nome },
          ]}
        />
      )}

      <p>
        <Link to="/regioes">← Voltar para regiões</Link>
      </p>
    </section>
  )
}
