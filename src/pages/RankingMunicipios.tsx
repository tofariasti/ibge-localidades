import { Link } from 'react-router-dom'
import { getEstados } from '../api/localidadesService'
import { Breadcrumb } from '../components/Breadcrumb'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'

export function RankingMunicipios() {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(getEstados)

  return (
    <section className="page rankings">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Rankings', to: '/rankings' },
          { label: 'Municípios' },
        ]}
      />
      <h1>Ranking de municípios</h1>
      <p className="page__lead">
        Escolha uma UF para ver o ranking dos municípios por população, área ou
        densidade (Censo 2022).
      </p>

      {loading && <Loading />}
      {error && !data && (
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      )}
      {data && (
        <ul className="ranking__uf-picker">
          {data.map((uf) => (
            <li key={uf.id}>
              <Link to={`/rankings/municipios/${uf.id}`}>
                {uf.nome} ({uf.sigla})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
