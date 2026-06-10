import { useCallback, useId, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BRAZIL_MAP_REGIONS,
  BRAZIL_MAP_STATES,
  BRAZIL_MAP_VIEWBOX,
  REGION_COLORS,
  getRegionName,
  type BrazilMapState,
} from '../data/brazilMap'

interface BrazilMapProps {
  /** Destaca o estado selecionado (ex.: página de detalhe da UF). */
  activeStateId?: number
  /** Realça uma macrorregião e atenua as demais (ex.: detalhe da região). */
  highlightRegionId?: number
  className?: string
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
}: BrazilMapProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const navigate = useNavigate()
  const titleId = useId()
  const descId = useId()

  const displayState = useMemo(() => {
    const id = hoveredId ?? focusedId ?? activeStateId ?? null
    return id != null ? BRAZIL_MAP_STATES.find((s) => s.id === id) ?? null : null
  }, [hoveredId, focusedId, activeStateId])

  const goToState = useCallback(
    (id: number) => {
      navigate(`/estados/${id}`)
    },
    [navigate],
  )

  return (
    <section
      className={['brazil-map', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="brazil-map__title">
        Mapa interativo
      </h2>
      <p id={descId} className="brazil-map__hint">
        Clique em um estado para ver detalhes. Use Tab para navegar pelo teclado.
      </p>

      <div className="brazil-map__canvas">
        <svg
          viewBox={BRAZIL_MAP_VIEWBOX}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          className="brazil-map__svg"
        >
          <title>Mapa do Brasil por unidade federativa</title>
          {BRAZIL_MAP_STATES.map((state) => (
            <path
              key={state.id}
              d={state.path}
              fill={REGION_COLORS[state.regiaoId]}
              className={stateClassName(
                state,
                hoveredId,
                activeStateId,
                highlightRegionId,
              )}
              tabIndex={0}
              role="link"
              aria-label={`${state.nome} (${state.sigla}), ${getRegionName(state.regiaoId)}`}
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
          ))}
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

      <p className="brazil-map__status" role="status" aria-live="polite">
        {displayState ? (
          <>
            <strong>{displayState.nome}</strong> ({displayState.sigla}) ·{' '}
            {getRegionName(displayState.regiaoId)}
          </>
        ) : (
          'Passe o mouse ou foque um estado para ver o nome.'
        )}
      </p>

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
    </section>
  )
}
