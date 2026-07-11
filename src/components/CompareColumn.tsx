import { Link } from 'react-router-dom'
import { buildIbgeApiUrl } from '../api/ibgeClient'
import { getEstado, getMunicipio } from '../api/localidadesService'
import type { CompareSlot } from '../lib/compareLocalidades'
import type { Municipio, UF } from '../types/localidades'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { DetailActions } from './DetailActions'
import { EmptyState } from './EmptyState'
import { ErrorMessage } from './ErrorMessage'
import { IndicadoresPanel } from './IndicadoresPanel'
import { Loading } from './Loading'

type CompareColumnProps = {
  slot: CompareSlot
  onRemove: () => void
}

function getUfFromMunicipio(municipio: Municipio): UF | null {
  if (municipio.microrregiao?.mesorregiao?.UF) {
    return municipio.microrregiao.mesorregiao.UF
  }
  if (municipio['regiao-imediata']?.['regiao-intermediaria']?.UF) {
    return municipio['regiao-imediata']['regiao-intermediaria'].UF
  }
  return null
}

function UfColumn({
  id,
  onRemove,
}: {
  id: number
  onRemove: () => void
}) {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () => getEstado(id),
    [id],
  )

  if (loading) {
    return (
      <article className="compare-column">
        <Loading />
      </article>
    )
  }

  if (error && !data) {
    return (
      <article className="compare-column">
        <div className="compare-column__toolbar">
          <button
            type="button"
            className="button button--secondary"
            onClick={onRemove}
          >
            Remover
          </button>
        </div>
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      </article>
    )
  }

  if (!data) {
    return (
      <article className="compare-column">
        <EmptyState message="Estado não encontrado." />
      </article>
    )
  }

  return (
    <article className="compare-column">
      <div className="compare-column__toolbar">
        <span className="compare-column__kind">UF</span>
        <button
          type="button"
          className="button button--secondary"
          onClick={onRemove}
        >
          Remover
        </button>
      </div>
      <h2 className="compare-column__title">
        <Link to={`/estados/${data.id}`}>
          {data.nome} ({data.sigla})
        </Link>
      </h2>
      <dl className="detail compare-column__detail">
        <dt>Código IBGE</dt>
        <dd>{data.id}</dd>
        <dt>Sigla</dt>
        <dd>{data.sigla}</dd>
        <dt>Região</dt>
        <dd>
          <Link to={`/regioes/${data.regiao.id}`}>
            {data.regiao.nome} ({data.regiao.sigla})
          </Link>
        </dd>
        <dt>Hierarquia</dt>
        <dd>
          {data.nome} → {data.regiao.nome}
        </dd>
      </dl>
      <IndicadoresPanel level="estado" id={data.id} />
      <DetailActions
        code={data.id}
        resource={data}
        apiUrl={buildIbgeApiUrl(`/estados/${data.id}`)}
      />
    </article>
  )
}

function MunicipioColumn({
  id,
  onRemove,
}: {
  id: number
  onRemove: () => void
}) {
  const { data, loading, error, refetch, refetching } = useIbgeQuery(
    () => getMunicipio(id),
    [id],
  )

  if (loading) {
    return (
      <article className="compare-column">
        <Loading />
      </article>
    )
  }

  if (error && !data) {
    return (
      <article className="compare-column">
        <div className="compare-column__toolbar">
          <button
            type="button"
            className="button button--secondary"
            onClick={onRemove}
          >
            Remover
          </button>
        </div>
        <ErrorMessage message={error} onRetry={refetch} retrying={refetching} />
      </article>
    )
  }

  if (!data) {
    return (
      <article className="compare-column">
        <EmptyState message="Município não encontrado." />
      </article>
    )
  }

  const uf = getUfFromMunicipio(data)
  const microrregiao = data.microrregiao
  const mesorregiao = microrregiao?.mesorregiao
  const imediata = data['regiao-imediata']
  const intermediaria = imediata?.['regiao-intermediaria']

  const hierarchyParts = [data.nome]
  if (uf) {
    hierarchyParts.push(uf.sigla, uf.regiao.nome)
  }

  return (
    <article className="compare-column">
      <div className="compare-column__toolbar">
        <span className="compare-column__kind">Município</span>
        <button
          type="button"
          className="button button--secondary"
          onClick={onRemove}
        >
          Remover
        </button>
      </div>
      <h2 className="compare-column__title">
        <Link to={`/municipios/${data.id}`}>{data.nome}</Link>
      </h2>
      <dl className="detail compare-column__detail">
        <dt>Código IBGE</dt>
        <dd>{data.id}</dd>
        {uf && (
          <>
            <dt>UF</dt>
            <dd>
              <Link to={`/estados/${uf.id}`}>
                {uf.nome} ({uf.sigla})
              </Link>
            </dd>
            <dt>Região</dt>
            <dd>
              <Link to={`/regioes/${uf.regiao.id}`}>
                {uf.regiao.nome} ({uf.regiao.sigla})
              </Link>
            </dd>
          </>
        )}
        {microrregiao && mesorregiao && (
          <>
            <dt>Microrregião</dt>
            <dd>
              <Link to={`/microrregioes/${microrregiao.id}`}>
                {microrregiao.nome}
              </Link>
            </dd>
            <dt>Mesorregião</dt>
            <dd>
              <Link to={`/mesorregioes/${mesorregiao.id}`}>
                {mesorregiao.nome}
              </Link>
            </dd>
          </>
        )}
        {imediata && intermediaria && (
          <>
            <dt>Região imediata</dt>
            <dd>
              <Link to={`/regioes-imediatas/${imediata.id}`}>
                {imediata.nome}
              </Link>
            </dd>
            <dt>Região intermediária</dt>
            <dd>
              <Link to={`/regioes-intermediarias/${intermediaria.id}`}>
                {intermediaria.nome}
              </Link>
            </dd>
          </>
        )}
        <dt>Hierarquia</dt>
        <dd>{hierarchyParts.join(' → ')}</dd>
      </dl>
      <IndicadoresPanel level="municipio" id={data.id} />
      <DetailActions
        code={data.id}
        resource={data}
        apiUrl={buildIbgeApiUrl(`/municipios/${data.id}`)}
      />
    </article>
  )
}

export function CompareColumn({ slot, onRemove }: CompareColumnProps) {
  if (slot.kind === 'uf') {
    return <UfColumn id={slot.id} onRemove={onRemove} />
  }
  return <MunicipioColumn id={slot.id} onRemove={onRemove} />
}
