import { Link, useParams } from 'react-router-dom'
import { getEstado, getMunicipiosPorUF } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { DataList } from '../components/DataList'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import type { Municipio } from '../types/localidades'

export function MunicipiosList() {
  const { id } = useParams<{ id: string }>()

  const estadoQuery = useIbgeQuery(() => getEstado(id!), [id])
  const municipiosQuery = useIbgeQuery(() => getMunicipiosPorUF(id!), [id])

  if (!id) return <ErrorMessage message="Estado não informado." />

  if (estadoQuery.loading || municipiosQuery.loading) return <Loading />

  if (estadoQuery.error) {
    return <ErrorMessage message={estadoQuery.error} onRetry={estadoQuery.refetch} />
  }

  const estado = estadoQuery.data!

  return (
    <section className="page">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Estados', to: '/estados' },
          { label: estado.nome, to: `/estados/${estado.id}` },
          { label: 'Municípios' },
        ]}
      />
      <h1>
        Municípios — {estado.nome} ({estado.sigla})
      </h1>

      {municipiosQuery.error ? (
        <ErrorMessage message={municipiosQuery.error} onRetry={municipiosQuery.refetch} />
      ) : municipiosQuery.data?.length ? (
        <DataList<Municipio>
          items={municipiosQuery.data}
          getRowKey={(m) => m.id}
          getRowLink={(m) => `/municipios/${m.id}`}
          columns={[
            { header: 'ID', render: (m) => m.id },
            { header: 'Nome', render: (m) => m.nome },
          ]}
        />
      ) : (
        <p>Nenhum município encontrado.</p>
      )}

      <p>
        <Link to={`/estados/${estado.id}`}>← Voltar para {estado.sigla}</Link>
      </p>
    </section>
  )
}
