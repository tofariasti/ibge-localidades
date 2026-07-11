import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getPopulacaoPorUf } from '../api/indicadoresService'
import { BrazilMap, type BrazilMapMode } from '../components/BrazilMap'
import { useIbgeQuery } from '../hooks/useIbgeQuery'

export function Home() {
  const [mapMode, setMapMode] = useState<BrazilMapMode>('navigation')
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
        <Link to="/paises" className="card">
          <h2>Países</h2>
          <p>Países e áreas com códigos M49 e ISO</p>
        </Link>
      </div>
    </section>
  )
}
