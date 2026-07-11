import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  formatFrequencia,
  formatNomePeriodo,
  getFrequenciaNome,
  getRankingNomes,
} from '../api/nomesService'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { useIbgeQuery } from '../hooks/useIbgeQuery'
import { useModules } from '../hooks/useModules'
import { formatQueryDate } from '../api/indicadoresService'
import type { NomeSexo } from '../types/nomes'

type NomesTab = 'frequencia' | 'ranking'

function parseSexo(raw: string | null): NomeSexo | '' {
  if (raw === 'M' || raw === 'F') return raw
  return ''
}

function parseTab(raw: string | null): NomesTab {
  return raw === 'ranking' ? 'ranking' : 'frequencia'
}

export function Nomes() {
  const { isEnabled, setOptionalEnabled } = useModules()
  const [searchParams, setSearchParams] = useSearchParams()

  const tab = parseTab(searchParams.get('aba'))
  const nomeParam = searchParams.get('nome') ?? ''
  const localidadeParam = searchParams.get('localidade') ?? 'BR'
  const sexoParam = parseSexo(searchParams.get('sexo'))
  const decadaParam = searchParams.get('decada') ?? '2000'

  const [nomeDraft, setNomeDraft] = useState(nomeParam || 'Maria')
  const [localidadeDraft, setLocalidadeDraft] = useState(localidadeParam)
  const [sexoDraft, setSexoDraft] = useState<NomeSexo | ''>(sexoParam)
  const [decadaDraft, setDecadaDraft] = useState(decadaParam)

  const freqEnabled = isEnabled('nomes') && tab === 'frequencia' && !!nomeParam
  const rankEnabled = isEnabled('nomes') && tab === 'ranking'

  const freqQuery = useIbgeQuery(
    () =>
      getFrequenciaNome({
        nome: nomeParam,
        localidade: localidadeParam || undefined,
        sexo: sexoParam,
      }),
    [nomeParam, localidadeParam, sexoParam],
    freqEnabled,
  )

  const rankQuery = useIbgeQuery(
    () =>
      getRankingNomes({
        decada: decadaParam || undefined,
        localidade: localidadeParam || undefined,
        sexo: sexoParam,
      }),
    [decadaParam, localidadeParam, sexoParam],
    rankEnabled,
  )

  const maxFreq = useMemo(() => {
    if (!freqQuery.data) return 1
    return Math.max(...freqQuery.data.points.map((p) => p.frequencia), 1)
  }, [freqQuery.data])

  function applyParams(next: Record<string, string>) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(next)) {
          if (!value) params.delete(key)
          else params.set(key, value)
        }
        if (!params.get('modulos')?.includes('nomes')) {
          const current = params.get('modulos')
          params.set(
            'modulos',
            current ? `${current},nomes` : 'nomes',
          )
        }
        return params
      },
      { replace: true },
    )
  }

  function onSubmitFrequencia(event: FormEvent) {
    event.preventDefault()
    applyParams({
      aba: 'frequencia',
      nome: nomeDraft.trim(),
      localidade: localidadeDraft.trim() || 'BR',
      sexo: sexoDraft,
      decada: '',
    })
  }

  function onSubmitRanking(event: FormEvent) {
    event.preventDefault()
    applyParams({
      aba: 'ranking',
      nome: '',
      localidade: localidadeDraft.trim() || 'BR',
      sexo: sexoDraft,
      decada: decadaDraft.trim() || '2000',
    })
  }

  if (!isEnabled('nomes')) {
    return (
      <section className="page">
        <h1>Nomes</h1>
        <p>
          Este módulo está inativo. Ative-o no catálogo para consultar a API de
          Nomes do IBGE.
        </p>
        <p className="action-bar__buttons">
          <button
            type="button"
            className="button"
            onClick={() => setOptionalEnabled('nomes', true)}
          >
            Ativar módulo Nomes
          </button>
          <Link to="/modulos" className="button button--secondary">
            Ver módulos
          </Link>
        </p>
      </section>
    )
  }

  return (
    <section className="page nomes">
      <h1>Nomes no Brasil</h1>
      <p>
        Frequência e ranking de nomes por década de nascimento (Censo 2010).
        Localidade: <code>BR</code>, id de UF (ex. <code>35</code>) ou município
        (ex. <code>3550308</code>).
      </p>

      <div className="map-mode-toggle" role="tablist" aria-label="Modo Nomes">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'frequencia'}
          className={
            tab === 'frequencia'
              ? 'map-mode-toggle__btn is-active'
              : 'map-mode-toggle__btn'
          }
          onClick={() =>
            applyParams({
              aba: 'frequencia',
              nome: nomeDraft.trim() || nomeParam || 'Maria',
              localidade: localidadeDraft.trim() || 'BR',
              sexo: sexoDraft,
            })
          }
        >
          Frequência
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'ranking'}
          className={
            tab === 'ranking'
              ? 'map-mode-toggle__btn is-active'
              : 'map-mode-toggle__btn'
          }
          onClick={() =>
            applyParams({
              aba: 'ranking',
              decada: decadaDraft.trim() || '2000',
              localidade: localidadeDraft.trim() || 'BR',
              sexo: sexoDraft,
              nome: '',
            })
          }
        >
          Ranking
        </button>
      </div>

      {tab === 'frequencia' ? (
        <form className="nomes__form" onSubmit={onSubmitFrequencia}>
          <label>
            Nome
            <input
              value={nomeDraft}
              onChange={(e) => setNomeDraft(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <label>
            Localidade
            <input
              value={localidadeDraft}
              onChange={(e) => setLocalidadeDraft(e.target.value)}
              placeholder="BR, 35, 3550308…"
              autoComplete="off"
            />
          </label>
          <label>
            Sexo
            <select
              value={sexoDraft}
              onChange={(e) =>
                setSexoDraft(parseSexo(e.target.value || null))
              }
            >
              <option value="">Todos</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
          </label>
          <button type="submit" className="button">
            Consultar
          </button>
        </form>
      ) : (
        <form className="nomes__form" onSubmit={onSubmitRanking}>
          <label>
            Década
            <input
              value={decadaDraft}
              onChange={(e) => setDecadaDraft(e.target.value)}
              placeholder="2000"
              inputMode="numeric"
              autoComplete="off"
            />
          </label>
          <label>
            Localidade
            <input
              value={localidadeDraft}
              onChange={(e) => setLocalidadeDraft(e.target.value)}
              placeholder="BR, 35, 3550308…"
              autoComplete="off"
            />
          </label>
          <label>
            Sexo
            <select
              value={sexoDraft}
              onChange={(e) =>
                setSexoDraft(parseSexo(e.target.value || null))
              }
            >
              <option value="">Todos</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
          </label>
          <button type="submit" className="button">
            Consultar
          </button>
        </form>
      )}

      {tab === 'frequencia' && (
        <>
          {!nomeParam && (
            <p className="nomes__hint">Informe um nome e clique em Consultar.</p>
          )}
          {freqEnabled && freqQuery.loading && <Loading />}
          {freqEnabled && freqQuery.error && !freqQuery.data && (
            <ErrorMessage
              message={freqQuery.error}
              onRetry={freqQuery.refetch}
              retrying={freqQuery.refetching}
            />
          )}
          {freqQuery.data && (
            <>
              <h2>
                {freqQuery.data.nome}{' '}
                <span className="nomes__meta">
                  · localidade {freqQuery.data.localidade}
                </span>
              </h2>
              <div
                className="serie-temporal__chart"
                role="img"
                aria-label={`Frequência de ${freqQuery.data.nome} por década`}
              >
                {freqQuery.data.points.map((point) => {
                  const height = Math.max(
                    4,
                    (point.frequencia / maxFreq) * 100,
                  )
                  return (
                    <div
                      key={point.periodo}
                      className="serie-temporal__bar-wrap"
                    >
                      <div
                        className="serie-temporal__bar"
                        style={{ height: `${height}%` }}
                        title={`${formatNomePeriodo(point.periodo)}: ${formatFrequencia(point.frequencia)}`}
                      />
                      <span className="serie-temporal__bar-label">
                        {formatNomePeriodo(point.periodo)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <table className="data-list">
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  {freqQuery.data.points.map((point) => (
                    <tr key={point.periodo}>
                      <td>{formatNomePeriodo(point.periodo)}</td>
                      <td>{formatFrequencia(point.frequencia)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="indicadores__source">
                Fonte: {freqQuery.data.sourceLabel} · consulta em{' '}
                {formatQueryDate(freqQuery.data.queriedAt)} ·{' '}
                <a
                  href={freqQuery.data.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  ver na API
                </a>
              </p>
            </>
          )}
        </>
      )}

      {tab === 'ranking' && (
        <>
          {rankQuery.loading && <Loading />}
          {rankQuery.error && !rankQuery.data && (
            <ErrorMessage
              message={rankQuery.error}
              onRetry={rankQuery.refetch}
              retrying={rankQuery.refetching}
            />
          )}
          {rankQuery.data && (
            <>
              <h2>
                Ranking
                <span className="nomes__meta">
                  {' '}
                  · localidade {rankQuery.data.localidade}
                  {decadaParam ? ` · década ${decadaParam}` : ''}
                </span>
              </h2>
              <table className="data-list">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  {rankQuery.data.entries.map((entry) => (
                    <tr key={`${entry.rank}-${entry.nome}`}>
                      <td>{entry.rank}</td>
                      <td>{entry.nome}</td>
                      <td>{formatFrequencia(entry.frequencia)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="indicadores__source">
                Fonte: {rankQuery.data.sourceLabel} · consulta em{' '}
                {formatQueryDate(rankQuery.data.queriedAt)} ·{' '}
                <a
                  href={rankQuery.data.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  ver na API
                </a>
              </p>
            </>
          )}
        </>
      )}

      <p>
        <Link to="/modulos">Gerenciar módulos</Link>
      </p>
    </section>
  )
}
