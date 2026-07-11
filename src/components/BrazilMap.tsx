import { useCallback, useId, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  formatIndicatorValue,
  formatQueryDate,
} from '../api/indicadoresService'
import {
  BRAZIL_MAP_REGIONS,
  BRAZIL_MAP_STATES,
  BRAZIL_MAP_VIEWBOX,
  REGION_COLORS,
  getRegionName,
  type BrazilMapState,
} from '../data/brazilMap'
import {
  choroplethLegendStops,
  extent,
  valueToChoroplethColor,
} from '../lib/choropleth'
import type { UfIndicatorSeries } from '../types/indicadores'
import { ErrorMessage } from './ErrorMessage'
import { Loading } from './Loading'

export type BrazilMapMode = 'navigation' | 'indicator'

interface BrazilMapProps {
  /** Destaca o estado selecionado (ex.: página de detalhe da UF). */
  activeStateId?: number
  /** Realça uma macrorregião e atenua as demais (ex.: detalhe da região). */
  highlightRegionId?: number
  className?: string
  /** `navigation` = cores por região; `indicator` = coroplético. */
  mode?: BrazilMapMode
  /** Série por UF quando `mode="indicator"`. */
  indicatorSeries?: UfIndicatorSeries | null
  indicatorLoading?: boolean
  indicatorError?: string | null
  onIndicatorRetry?: () => void
  indicatorRetrying?: boolean
}

function stateClassName(
  state: BrazilMapState,
  hoveredId: number | null,
  activeStateId?: number,
  highlightRegionId?: number,
): string {
  const classes = ['brazil-map__state']
  if (state.id === activeStateId) classes.push('is-active')
  if (state.id === hoveredId) classes.push('is-hovered')
  if (highlightRegionId != null && state.regiaoId !== highlightRegionId) {
    classes.push('is-dimmed')
  }
  return classes.join(' ')
}

export function BrazilMap({
  activeStateId,
  highlightRegionId,
  className,
  mode = 'navigation',
  indicatorSeries = null,
  indicatorLoading = false,
  indicatorError = null,
  onIndicatorRetry,
  indicatorRetrying = false,
}: BrazilMapProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const navigate = useNavigate()
  const titleId = useId()
  const descId = useId()
  const isIndicator = mode === 'indicator'

  const displayState = useMemo(() => {
    const id = hoveredId ?? focusedId ?? activeStateId ?? null
    return id != null ? (BRAZIL_MAP_STATES.find((s) => s.id === id) ?? null) : null
  }, [hoveredId, focusedId, activeStateId])

  const { min, max, legendStops } = useMemo(() => {
    const values = indicatorSeries
      ? Object.values(indicatorSeries.valuesByUfId)
      : []
    const range = extent(values)
    return {
      ...range,
      legendStops: choroplethLegendStops(range.min, range.max),
    }
  }, [indicatorSeries])

  const fillForState = useCallback(
    (state: BrazilMapState): string => {
      if (!isIndicator || !indicatorSeries) {
        return REGION_COLORS[state.regiaoId]
      }
      return valueToChoroplethColor(
        indicatorSeries.valuesByUfId[state.id],
        min,
        max,
      )
    },
    [isIndicator, indicatorSeries, min, max],
  )

  const goToState = useCallback(
    (id: number) => {
      navigate(`/estados/${id}`)
    },
    [navigate],
  )

  const indicatorValue =
    displayState && indicatorSeries
      ? indicatorSeries.valuesByUfId[displayState.id]
      : undefined

  return (
    <section
      className={['brazil-map', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="brazil-map__title">
        {isIndicator ? 'Mapa coroplético' : 'Mapa interativo'}
      </h2>
      <p id={descId} className="brazil-map__hint">
        {isIndicator
          ? `${indicatorSeries?.variableLabel ?? 'Indicador'} por UF (Censo ${indicatorSeries?.period ?? '…'}). Clique para abrir o estado.`
          : 'Clique em um estado para ver detalhes. Use Tab para navegar pelo teclado.'}
      </p>

      {isIndicator && indicatorLoading && !indicatorSeries && <Loading />}

      {isIndicator && indicatorError && !indicatorSeries && (
        <ErrorMessage
          message={indicatorError}
          onRetry={onIndicatorRetry}
          retrying={indicatorRetrying}
        />
      )}

      {(!isIndicator || indicatorSeries) && (
        <div className="brazil-map__canvas">
          <svg
            viewBox={BRAZIL_MAP_VIEWBOX}
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            className="brazil-map__svg"
          >
            <title>
              {isIndicator
                ? `Mapa coroplético do Brasil — ${indicatorSeries?.variableLabel ?? 'indicador'}`
                : 'Mapa do Brasil por unidade federativa'}
            </title>
            {BRAZIL_MAP_STATES.map((state) => {
              const value = indicatorSeries?.valuesByUfId[state.id]
              const valueLabel =
                isIndicator && value != null && indicatorSeries
                  ? `, ${formatIndicatorValue(value, indicatorSeries.unit)}`
                  : ''
              return (
                <path
                  key={state.id}
                  d={state.path}
                  fill={fillForState(state)}
                  className={stateClassName(
                    state,
                    hoveredId,
                    activeStateId,
                    highlightRegionId,
                  )}
                  tabIndex={0}
                  role="link"
                  aria-label={`${state.nome} (${state.sigla}), ${getRegionName(state.regiaoId)}${valueLabel}`}
                  onClick={() => goToState(state.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      goToState(state.id)
                    }
                  }}
                  onMouseEnter={() => setHoveredId(state.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setFocusedId(state.id)}
                  onBlur={() => setFocusedId(null)}
                />
              )
            })}
            {BRAZIL_MAP_STATES.map((state) => (
              <text
                key={`label-${state.id}`}
                x={state.labelX}
                y={state.labelY}
                className="brazil-map__label"
                aria-hidden="true"
                pointerEvents="none"
              >
                {state.sigla}
              </text>
            ))}
          </svg>
        </div>
      )}

      <p className="brazil-map__status" role="status" aria-live="polite">
        {displayState ? (
          <>
            <strong>{displayState.nome}</strong> ({displayState.sigla}) ·{' '}
            {getRegionName(displayState.regiaoId)}
            {isIndicator && indicatorSeries && (
              <>
                {' '}
                ·{' '}
                <span className="brazil-map__tooltip-value">
                  {formatIndicatorValue(
                    indicatorValue ?? null,
                    indicatorSeries.unit,
                  )}
                </span>
              </>
            )}
          </>
        ) : (
          'Passe o mouse ou foque um estado para ver o nome.'
        )}
      </p>

      {isIndicator && indicatorSeries ? (
        <div className="brazil-map__choropleth-legend">
          <p className="brazil-map__choropleth-legend-title">
            {indicatorSeries.variableLabel} ({indicatorSeries.period})
          </p>
          <div
            className="brazil-map__choropleth-scale"
            role="img"
            aria-label={`Escala de ${formatIndicatorValue(min, indicatorSeries.unit)} a ${formatIndicatorValue(max, indicatorSeries.unit)}`}
          >
            {legendStops.map((stop) => (
              <span
                key={stop.t}
                className="brazil-map__choropleth-swatch"
                style={{ backgroundColor: stop.color }}
                title={formatIndicatorValue(stop.value, indicatorSeries.unit)}
              />
            ))}
          </div>
          <div className="brazil-map__choropleth-labels">
            <span>{formatIndicatorValue(min, indicatorSeries.unit)}</span>
            <span>{formatIndicatorValue(max, indicatorSeries.unit)}</span>
          </div>
          <p className="brazil-map__credit">
            Fonte: {indicatorSeries.sourceLabel} · consulta em{' '}
            {formatQueryDate(indicatorSeries.queriedAt)} ·{' '}
            <a
              href={indicatorSeries.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              ver agregado
            </a>
          </p>
        </div>
      ) : (
        !isIndicator && (
          <ul className="brazil-map__legend">
            {BRAZIL_MAP_REGIONS.map((region) => (
              <li key={region.id}>
                <Link
                  to={`/regioes/${region.id}`}
                  className="brazil-map__legend-link"
                >
                  <span
                    className="brazil-map__legend-swatch"
                    style={{ backgroundColor: REGION_COLORS[region.id] }}
                    aria-hidden="true"
                  />
                  <span>
                    {region.nome} ({region.sigla})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )
      )}

      {!isIndicator && (
        <p className="brazil-map__credit">
          Malha simplificada da{' '}
          <a
            href="https://servicodados.ibge.gov.br/api/docs/malhas?versao=3"
            target="_blank"
            rel="noreferrer"
          >
            API de Malhas do IBGE
          </a>
          . Renderização em SVG embutido (~68 KB) — sem MapLibre/Leaflet, para
          carregamento rápido no GitHub Pages.
        </p>
      )}
    </section>
  )
}
