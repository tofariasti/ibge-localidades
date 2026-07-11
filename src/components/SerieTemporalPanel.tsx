import { Link } from 'react-router-dom'
import {
  formatIndicatorValue,
  formatQueryDate,
  getSerieEstado,
  getSerieMunicipio,
} from '../api/seriesService'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { ErrorMessage } from './ErrorMessage'
import { Loading } from './Loading'

type SerieTemporalPanelProps =
  | { level: 'estado'; id: number | string }
  | { level: 'municipio'; id: number | string }

export function SerieTemporalPanel(props: SerieTemporalPanelProps) {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () =>
      props.level === 'estado'
        ? getSerieEstado(props.id)
        : getSerieMunicipio(props.id),
    [props.level, props.id],
  )

  const max = data
    ? Math.max(...data.points.map((p) => p.value ?? 0), 1)
    : 1

  return (
    <aside className="serie-temporal" aria-labelledby="serie-temporal-title">
      <h2 id="serie-temporal-title" className="serie-temporal__title">
        Série temporal
      </h2>
      <p className="serie-temporal__lead">
        População residente estimada (últimos períodos disponíveis).
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
          <p className="serie-temporal__var">{data.variableLabel}</p>
          <div
            className="serie-temporal__chart"
            role="img"
            aria-label={`Série de ${data.variableLabel} por ano`}
          >
            {data.points.map((point) => {
              const height =
                point.value == null ? 0 : Math.max(4, (point.value / max) * 100)
              return (
                <div key={point.period} className="serie-temporal__bar-wrap">
                  <div
                    className="serie-temporal__bar"
                    style={{ height: `${height}%` }}
                    title={
                      point.value == null
                        ? `${point.period}: —`
                        : `${point.period}: ${formatIndicatorValue(point.value, data.unit)}`
                    }
                  />
                  <span className="serie-temporal__bar-label">
                    {point.period}
                  </span>
                </div>
              )
            })}
          </div>
          <table className="serie-temporal__table">
            <thead>
              <tr>
                <th scope="col">Ano</th>
                <th scope="col">População</th>
              </tr>
            </thead>
            <tbody>
              {data.points.map((point) => (
                <tr key={point.period}>
                  <td>{point.period}</td>
                  <td>
                    {formatIndicatorValue(point.value, data.unit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="serie-temporal__source">
            Fonte: {data.sourceLabel} · consulta em{' '}
            {formatQueryDate(data.queriedAt)} ·{' '}
            <a href={data.sourceUrl} target="_blank" rel="noreferrer">
              ver agregado
            </a>
            {' · '}
            <Link to="/modulos">módulos</Link>
          </p>
        </>
      )}
    </aside>
  )
}
