import type { Municipio, Regiao, UF } from '../types/localidades'
import { normalizeText } from './text'

export type SearchHitKind = 'regiao' | 'estado' | 'municipio'

export interface SearchHit {
  kind: SearchHitKind
  id: number
  label: string
  hierarchy: string
  to: string
}

export interface SearchIndexData {
  regioes: Regiao[]
  estados: UF[]
  municipios: Municipio[]
}

function scoreMatch(candidate: string, query: string): number | null {
  const nCandidate = normalizeText(candidate)
  const nQuery = normalizeText(query)
  if (!nQuery || !nCandidate.includes(nQuery)) return null
  if (nCandidate === nQuery) return 100
  if (nCandidate.startsWith(nQuery)) return 80
  return 50
}

function bestScore(parts: Array<string | number | undefined>, query: string): number | null {
  let best: number | null = null
  for (const part of parts) {
    if (part == null) continue
    const score = scoreMatch(String(part), query)
    if (score != null && (best == null || score > best)) best = score
  }
  return best
}

function municipioUf(municipio: Municipio): UF | null {
  return (
    municipio.microrregiao?.mesorregiao?.UF ??
    municipio['regiao-imediata']?.['regiao-intermediaria']?.UF ??
    null
  )
}

const KIND_ORDER: Record<SearchHitKind, number> = {
  regiao: 0,
  estado: 1,
  municipio: 2,
}

/** Busca regiões, UFs e municípios por nome, sigla ou código IBGE. */
export function searchLocalidades(
  index: SearchIndexData,
  query: string,
  limit = 12,
): SearchHit[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const scored: Array<SearchHit & { score: number }> = []

  for (const r of index.regioes) {
    const score = bestScore([r.id, r.nome, r.sigla], trimmed)
    if (score == null) continue
    scored.push({
      kind: 'regiao',
      id: r.id,
      label: r.nome,
      hierarchy: `Região · ${r.sigla}`,
      to: `/regioes/${r.id}`,
      score,
    })
  }

  for (const uf of index.estados) {
    const score = bestScore([uf.id, uf.nome, uf.sigla], trimmed)
    if (score == null) continue
    scored.push({
      kind: 'estado',
      id: uf.id,
      label: `${uf.nome} (${uf.sigla})`,
      hierarchy: `${uf.nome} → ${uf.regiao.nome}`,
      to: `/estados/${uf.id}`,
      score,
    })
  }

  for (const m of index.municipios) {
    const uf = municipioUf(m)
    const score = bestScore(
      [m.id, m.nome, uf?.sigla, uf?.nome],
      trimmed,
    )
    if (score == null) continue
    const hierarchy = uf
      ? `${m.nome} → ${uf.sigla} → ${uf.regiao.nome}`
      : m.nome
    scored.push({
      kind: 'municipio',
      id: m.id,
      label: m.nome,
      hierarchy,
      to: `/municipios/${m.id}`,
      score,
    })
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (KIND_ORDER[a.kind] !== KIND_ORDER[b.kind]) {
      return KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
    }
    return a.label.localeCompare(b.label, 'pt-BR')
  })

  return scored.slice(0, limit).map((item) => ({
    kind: item.kind,
    id: item.id,
    label: item.label,
    hierarchy: item.hierarchy,
    to: item.to,
  }))
}
