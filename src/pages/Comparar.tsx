import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'
import { CompareColumn } from '../components/CompareColumn'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { useSearchIndex } from '../hooks/useSearchIndex'
import { copyToClipboard } from '../lib/clipboard'
import {
  canAddSlot,
  COMPARE_MAX_SLOTS,
  parseCompareIds,
  serializeCompareIds,
  slotKey,
  type CompareSlot,
} from '../lib/compareLocalidades'
import {
  searchLocalidades,
  type SearchHit,
} from '../lib/searchLocalidades'

const KIND_LABEL: Record<'estado' | 'municipio', string> = {
  estado: 'Estado',
  municipio: 'Município',
}

function hitToSlot(hit: SearchHit): CompareSlot | null {
  if (hit.kind === 'estado') return { kind: 'uf', id: hit.id }
  if (hit.kind === 'municipio') return { kind: 'municipio', id: hit.id }
  return null
}

export function Comparar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const slots = useMemo(
    () => parseCompareIds(searchParams.get('ids')),
    [searchParams],
  )

  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { message, show } = useActionFeedback()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [pickerEnabled, setPickerEnabled] = useState(false)

  const { data, loading, error } = useSearchIndex(pickerEnabled)

  const results = useMemo(() => {
    if (!data || !query.trim()) return []
    return searchLocalidades(data, query, 16).filter(
      (hit): hit is SearchHit & { kind: 'estado' | 'municipio' } =>
        hit.kind === 'estado' || hit.kind === 'municipio',
    )
  }, [data, query])

  const safeIndex =
    results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1)

  const setSlots = useCallback(
    (next: CompareSlot[]) => {
      if (next.length === 0) {
        setSearchParams({}, { replace: true })
      } else {
        setSearchParams(
          { ids: serializeCompareIds(next) },
          { replace: true },
        )
      }
    },
    [setSearchParams],
  )

  const addSlot = useCallback(
    (slot: CompareSlot) => {
      if (!canAddSlot(slots, slot)) return
      setSlots([...slots, slot])
      setQuery('')
      setActiveIndex(0)
      setOpen(false)
      inputRef.current?.blur()
    },
    [setSlots, slots],
  )

  const removeSlot = useCallback(
    (key: string) => {
      setSlots(slots.filter((s) => slotKey(s) !== key))
    },
    [setSlots, slots],
  )

  useEffect(() => {
    function onDocMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

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
      if (!hit) return
      const slot = hitToSlot(hit)
      if (slot) addSlot(slot)
      return
    }
    if (event.key === 'Escape') {
      setOpen(false)
      setQuery('')
      setActiveIndex(0)
      inputRef.current?.blur()
    }
  }

  async function copyShareLink() {
    try {
      await copyToClipboard(window.location.href)
      show('Link da comparação copiado')
    } catch {
      show('Não foi possível copiar')
    }
  }

  const canAddMore = slots.length < COMPARE_MAX_SLOTS
  const showPanel =
    open && canAddMore && (query.trim().length > 0 || loading || !!error)

  return (
    <section className="page comparar">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Comparar' },
        ]}
      />
      <h1>Comparar localidades</h1>
      <p className="page__lead">
        Selecione 2 ou até {COMPARE_MAX_SLOTS} municípios ou UFs para ver códigos,
        hierarquia e indicadores lado a lado. O link da página é compartilhável.
      </p>

      <div className="comparar__picker" ref={rootRef}>
        <label className="comparar__picker-label" htmlFor={`${listId}-input`}>
          Adicionar localidade
        </label>
        <div className="comparar__picker-row">
          <input
            ref={inputRef}
            id={`${listId}-input`}
            className="comparar__picker-input"
            type="search"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              showPanel && results[safeIndex]
                ? `${listId}-option-${safeIndex}`
                : undefined
            }
            placeholder={
              canAddMore
                ? 'Nome, sigla ou código IBGE'
                : `Limite de ${COMPARE_MAX_SLOTS} localidades`
            }
            value={query}
            autoComplete="off"
            disabled={!canAddMore}
            onFocus={() => {
              setPickerEnabled(true)
              setOpen(true)
            }}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
              setOpen(true)
            }}
            onKeyDown={onKeyDown}
          />
          {slots.length > 0 && (
            <button
              type="button"
              className="button button--secondary"
              onClick={copyShareLink}
            >
              Copiar link
            </button>
          )}
        </div>

        {showPanel && (
          <div className="comparar__picker-panel" id={listId} role="listbox">
            {loading && !data && (
              <p className="comparar__picker-status">Carregando índice…</p>
            )}
            {error && !data && (
              <p className="comparar__picker-status comparar__picker-status--error">
                {error}
              </p>
            )}
            {data && query.trim() && results.length === 0 && (
              <p className="comparar__picker-status">Nenhum resultado.</p>
            )}
            {results.map((hit, index) => {
              const slot = hitToSlot(hit)
              const already =
                slot != null &&
                slots.some((s) => slotKey(s) === slotKey(slot))
              return (
                <button
                  key={`${hit.kind}-${hit.id}`}
                  type="button"
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={index === safeIndex}
                  disabled={already || !slot}
                  className={
                    index === safeIndex
                      ? 'comparar__picker-option is-active'
                      : 'comparar__picker-option'
                  }
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    if (slot && !already) addSlot(slot)
                  }}
                >
                  <span className="comparar__picker-option-kind">
                    {KIND_LABEL[hit.kind]}
                  </span>
                  <span className="comparar__picker-option-label">
                    {hit.label}
                  </span>
                  <span className="comparar__picker-option-hierarchy">
                    {already ? 'Já selecionado' : hit.hierarchy}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {message && (
          <p className="action-bar__feedback" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </div>

      {slots.length === 0 && (
        <p className="comparar__hint">
          Busque e adicione pelo menos duas localidades para comparar. Exemplos:{' '}
          <Link to="/comparar?ids=uf%3A35%2Cuf%3A33">SP × RJ (UFs)</Link>
          {' · '}
          <Link to="/comparar?ids=mun%3A3550308%2Cmun%3A3304557">
            São Paulo × Rio (municípios)
          </Link>
        </p>
      )}

      {slots.length === 1 && (
        <p className="comparar__hint">
          Adicione mais uma localidade para ver a comparação lado a lado.
        </p>
      )}

      {slots.length >= 2 && (
        <div
          className="comparar__grid"
          style={{ '--comparar-cols': String(slots.length) } as CSSProperties}
        >
          {slots.map((slot) => (
            <CompareColumn
              key={slotKey(slot)}
              slot={slot}
              onRemove={() => removeSlot(slotKey(slot))}
            />
          ))}
        </div>
      )}

      {slots.length === 1 && (
        <div className="comparar__grid comparar__grid--single">
          <CompareColumn
            slot={slots[0]}
            onRemove={() => removeSlot(slotKey(slots[0]))}
          />
        </div>
      )}
    </section>
  )
}
