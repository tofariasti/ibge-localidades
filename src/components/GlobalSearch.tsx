import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchIndex } from '../hooks/useSearchIndex'
import {
  searchLocalidades,
  type SearchHit,
} from '../lib/searchLocalidades'

const KIND_LABEL: Record<SearchHit['kind'], string> = {
  regiao: 'Região',
  estado: 'Estado',
  municipio: 'Município',
}

export function GlobalSearch() {
  const navigate = useNavigate()
  const listId = useId()
  const hintId = useId()
  const statusId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [enabled, setEnabled] = useState(false)

  const { data, loading, error } = useSearchIndex(enabled)

  const results = useMemo(() => {
    if (!data || !query.trim()) return []
    return searchLocalidades(data, query)
  }, [data, query])

  const safeIndex =
    results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1)

  useEffect(() => {
    function onDocMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  const goTo = useCallback(
    (hit: SearchHit) => {
      navigate(hit.to)
      setQuery('')
      setActiveIndex(0)
      setOpen(false)
      inputRef.current?.blur()
    },
    [navigate],
  )

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!results.length) return
      setActiveIndex((i) => (i + 1) % results.length)
      setOpen(true)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!results.length) return
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
      setOpen(true)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const hit = results[safeIndex]
      if (hit) goTo(hit)
      return
    }
    if (event.key === 'Escape') {
      setOpen(false)
      setQuery('')
      setActiveIndex(0)
      inputRef.current?.blur()
    }
  }

  const showPanel = open && (query.trim().length > 0 || loading || !!error)
  const statusText = loading && !data
    ? 'Carregando índice de busca.'
    : error && !data
      ? error
      : data && query.trim()
        ? results.length === 0
          ? 'Nenhum resultado.'
          : `${results.length} resultado${results.length === 1 ? '' : 's'} disponíveis. Use as setas e Enter.`
        : ''

  return (
    <div className="global-search" ref={rootRef}>
      <label className="global-search__label" htmlFor={`${listId}-input`}>
        Buscar localidade
      </label>
      <p id={hintId} className="global-search__hint">
        Busque por nome, sigla de UF ou código IBGE. Setas e Enter navegam nos
        resultados.
      </p>
      <input
        ref={inputRef}
        id={`${listId}-input`}
        className="global-search__input"
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-busy={loading && !data}
        aria-describedby={`${hintId} ${statusId}`}
        aria-activedescendant={
          showPanel && results[safeIndex]
            ? `${listId}-option-${safeIndex}`
            : undefined
        }
        placeholder="Nome, sigla ou código IBGE"
        value={query}
        autoComplete="off"
        onFocus={() => {
          setEnabled(true)
          setOpen(true)
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      <div id={statusId} className="visually-hidden" role="status" aria-live="polite">
        {statusText}
      </div>

      {showPanel && (
        <div className="global-search__panel" id={listId} role="listbox">
          {loading && !data && (
            <p className="global-search__status">Carregando índice…</p>
          )}
          {error && !data && (
            <p className="global-search__status global-search__status--error" role="alert">
              {error}
            </p>
          )}
          {data && query.trim() && results.length === 0 && (
            <p className="global-search__status">Nenhum resultado.</p>
          )}
          {results.map((hit, index) => (
            <button
              key={`${hit.kind}-${hit.id}`}
              type="button"
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={index === safeIndex}
              className={
                index === safeIndex
                  ? 'global-search__option is-active'
                  : 'global-search__option'
              }
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => goTo(hit)}
            >
              <span className="global-search__option-kind">
                {KIND_LABEL[hit.kind]}
              </span>
              <span className="global-search__option-label">{hit.label}</span>
              <span className="global-search__option-hierarchy">
                {hit.hierarchy}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
