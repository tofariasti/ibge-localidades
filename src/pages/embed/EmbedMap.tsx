import { useSearchParams } from 'react-router-dom'
import { getPopulacaoPorUf } from '../../api/indicadoresService'
import { BrazilMap, type BrazilMapMode } from '../../components/BrazilMap'
import { useEmbedPath } from '../../hooks/useEmbedBrand'
import { useIbgeQuery } from '../../hooks/useIbgeQuery'

function parseMapMode(raw: string | null): BrazilMapMode {
  return raw === 'indicador' ? 'indicator' : 'navigation'
}

export function EmbedMap() {
  const [searchParams, setSearchParams] = useSearchParams()
  const embedPath = useEmbedPath()
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
    <section className="page embed-page">
      <h1 className="embed-page__title">Mapa do Brasil</h1>
      <div className="embed-page__toolbar">
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
      </div>

      <BrazilMap
        className="embed-page__map"
        mode={mapMode}
        indicatorSeries={indicatorSeries}
        indicatorLoading={indicatorLoading}
        indicatorError={indicatorError}
        onIndicatorRetry={refetchIndicator}
        indicatorRetrying={indicatorRetrying}
        getStatePath={(id) => embedPath(`/embed/estados/${id}`)}
        getRegionPath={(id) => embedPath(`/embed/regioes/${id}`)}
      />
    </section>
  )
}
