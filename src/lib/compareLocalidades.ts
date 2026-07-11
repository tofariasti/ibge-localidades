/** Slot de comparação: UF ou município (até 3 na UI). */
export type CompareKind = 'uf' | 'municipio'

export interface CompareSlot {
  kind: CompareKind
  id: number
}

const MAX_SLOTS = 3

/** IDs de UF no IBGE são 11–53 (dois dígitos). Municípios têm 7 dígitos. */
function inferKind(id: number): CompareKind | null {
  if (!Number.isFinite(id) || id <= 0) return null
  if (id >= 11 && id <= 53) return 'uf'
  if (id >= 1000000 && id <= 9999999) return 'municipio'
  return null
}

function parseToken(token: string): CompareSlot | null {
  const trimmed = token.trim()
  if (!trimmed) return null

  const prefixed = /^(uf|mun|municipio):(\d+)$/i.exec(trimmed)
  if (prefixed) {
    const kind: CompareKind =
      prefixed[1].toLowerCase() === 'uf' ? 'uf' : 'municipio'
    const id = Number(prefixed[2])
    if (!Number.isFinite(id) || id <= 0) return null
    return { kind, id }
  }

  if (!/^\d+$/.test(trimmed)) return null
  const id = Number(trimmed)
  const kind = inferKind(id)
  if (!kind) return null
  return { kind, id }
}

export function slotKey(slot: CompareSlot): string {
  return `${slot.kind}:${slot.id}`
}

export function serializeCompareIds(slots: CompareSlot[]): string {
  return slots
    .slice(0, MAX_SLOTS)
    .map((s) => (s.kind === 'uf' ? `uf:${s.id}` : `mun:${s.id}`))
    .join(',')
}

/** Lê `ids` da query (`uf:35,mun:3550308` ou IDs numéricos inferidos). */
export function parseCompareIds(raw: string | null | undefined): CompareSlot[] {
  if (!raw?.trim()) return []

  const seen = new Set<string>()
  const slots: CompareSlot[] = []

  for (const token of raw.split(',')) {
    if (slots.length >= MAX_SLOTS) break
    const slot = parseToken(token)
    if (!slot) continue
    const key = slotKey(slot)
    if (seen.has(key)) continue
    seen.add(key)
    slots.push(slot)
  }

  return slots
}

export function buildComparePath(slots: CompareSlot[]): string {
  if (slots.length === 0) return '/comparar'
  return `/comparar?ids=${encodeURIComponent(serializeCompareIds(slots))}`
}

export function canAddSlot(
  slots: CompareSlot[],
  candidate: CompareSlot,
): boolean {
  if (slots.length >= MAX_SLOTS) return false
  return !slots.some((s) => slotKey(s) === slotKey(candidate))
}

export { MAX_SLOTS as COMPARE_MAX_SLOTS }
