import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getPopulacaoPorUf } from '../api/indicadoresService'
import { BrazilMap, type BrazilMapMode } from '../components/BrazilMap'
import { CopyViewLink } from '../components/CopyViewLink'
import { useIbgeQuery } from '../hooks/useIbgeQuery'

function parseMapMode(raw: string | null): BrazilMapMode {
  return raw === 'indicador' ? 'indicator' : 'navigation'
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mapMode = parseMapMode(searchParams.get('mapa'))

  function setMapMode(mode: BrazilMapMode) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (mode === 'indicator') next.set('mapa', 'indicador')
        else next.delete('mapa')
        return next
      },
      { replace: true },
    )
  }

  const {
    data: indicatorSeries,
    loading: indicatorLoading,
    error: indicatorError,
    refetch: refetchIndicator,
    refetching: indicatorRetrying,
  } = useIbgeQuery(getPopulacaoPorUf)

  return (
    <section className="page home">
      <h1>Localidades do Brasil</h1>
      <p>
        Explore a hierarquia geográfica oficial do IBGE: regiões, unidades
        federativas e municípios.
      </p>

      <div className="home__toolbar">
        <div className="map-mode-toggle" role="group" aria-label="Modo do mapa">
          <button
            type="button"
            className={
              mapMode === 'navigation'
                ? 'map-mode-toggle__btn is-active'
                : 'map-mode-toggle__btn'
            }
            aria-pressed={mapMode === 'navigation'}
            onClick={() => setMapMode('navigation')}
          >
            Navegação
          </button>
          <button
            type="button"
            className={
              mapMode === 'indicator'
                ? 'map-mode-toggle__btn is-active'
                : 'map-mode-toggle__btn'
            }
            aria-pressed={mapMode === 'indicator'}
            onClick={() => setMapMode('indicator')}
          >
            Indicador
          </button>
        </div>
        <CopyViewLink />
      </div>

      <BrazilMap
        className="home__map"
        mode={mapMode}
        indicatorSeries={indicatorSeries}
        indicatorLoading={indicatorLoading}
        indicatorError={indicatorError}
        onIndicatorRetry={refetchIndicator}
        indicatorRetrying={indicatorRetrying}
      />

      <div className="home-cards">
        <Link to="/regioes" className="card">
          <h2>Regiões</h2>
          <p>Norte, Nordeste, Centro-Oeste, Sudeste e Sul</p>
        </Link>
        <Link to="/estados" className="card">
          <h2>Estados</h2>
          <p>Todas as unidades federativas</p>
        </Link>
        <Link to="/rankings" className="card">
          <h2>Rankings</h2>
          <p>UFs e municípios por população, área ou densidade</p>
        </Link>
        <Link to="/comparar" className="card">
          <h2>Comparar</h2>
          <p>Até 3 municípios ou UFs lado a lado</p>
        </Link>
        <Link to="/salvos" className="card">
          <h2>Salvos</h2>
          <p>Favoritos e histórico neste navegador</p>
        </Link>
        <Link to="/paises" className="card">
          <h2>Países</h2>
          <p>Países e áreas com códigos M49 e ISO</p>
        </Link>
      </div>
    </section>
  )
}
