import {
  formatIndicatorValue,
  formatQueryDate,
  getIndicadoresEstado,
  getIndicadoresMunicipio,
} from '../api/indicadoresService'
import { ErrorMessage } from './ErrorMessage'
import { Loading } from './Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'

type IndicadoresPanelProps =
  | { level: 'estado'; id: number | string }
  | { level: 'municipio'; id: number | string }

export function IndicadoresPanel(props: IndicadoresPanelProps) {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () =>
      props.level === 'estado'
        ? getIndicadoresEstado(props.id)
        : getIndicadoresMunicipio(props.id),
    [props.level, props.id],
  )

  return (
    <aside className="indicadores" aria-labelledby="indicadores-title">
      <h2 id="indicadores-title" className="indicadores__title">
        Indicadores
      </h2>
      <p className="indicadores__lead">
        População, área e densidade do Censo Demográfico 2022.
      </p>

      {loading && <Loading />}

      {error && !data && (
        <ErrorMessage
          message={error}
          onRetry={refetch}
          retrying={refetching}
        />
      )}

      {data && (
        <>
          {error && (
            <ErrorMessage
              message={error}
              onRetry={refetch}
              retrying={refetching}
            />
          )}
          <dl className="indicadores__list">
            {data.indicators.map((item) => (
              <div key={item.id} className="indicadores__item">
                <dt>{item.label}</dt>
                <dd>
                  <span className="indicadores__value">
                    {formatIndicatorValue(item.value, item.unit)}
                  </span>
                  {!/pessoas|quilômetro|quilometro|habitante/i.test(
                    item.unit,
                  ) && (
                    <span className="indicadores__unit">{item.unit}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="indicadores__source">
            Fonte: {data.sourceLabel} · referência {data.period} · consulta em{' '}
            {formatQueryDate(data.queriedAt)} ·{' '}
            <a href={data.sourceUrl} target="_blank" rel="noreferrer">
              ver agregado
            </a>
          </p>
        </>
      )}
    </aside>
  )
}
