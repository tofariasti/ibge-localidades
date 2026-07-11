export type SavedKind = 'regiao' | 'estado' | 'municipio'

export type SavedItem = {
  kind: SavedKind
  id: number
  label: string
  to: string
}

export type HistoryItem = SavedItem & {
  visitedAt: number
}

const FAVORITES_KEY = 'ibge-favoritos:v1'
const HISTORY_KEY = 'ibge-historico:v1'
const HISTORY_LIMIT = 30
const CHANGE_EVENT = 'ibge-library-change'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function itemKey(kind: SavedKind, id: number): string {
  return `${kind}:${id}`
}

export function loadFavorites(): SavedItem[] {
  const items = readJson<SavedItem[]>(FAVORITES_KEY, [])
  return Array.isArray(items) ? items : []
}

export function loadHistory(): HistoryItem[] {
  const items = readJson<HistoryItem[]>(HISTORY_KEY, [])
  return Array.isArray(items) ? items : []
}

export function isFavorite(kind: SavedKind, id: number): boolean {
  return loadFavorites().some(
    (item) => item.kind === kind && item.id === id,
  )
}

export function toggleFavorite(item: SavedItem): boolean {
  const current = loadFavorites()
  const exists = current.some(
    (f) => f.kind === item.kind && f.id === item.id,
  )
  const next = exists
    ? current.filter((f) => !(f.kind === item.kind && f.id === item.id))
    : [item, ...current]
  writeJson(FAVORITES_KEY, next)
  return !exists
}

export function removeFavorite(kind: SavedKind, id: number): void {
  writeJson(
    FAVORITES_KEY,
    loadFavorites().filter((f) => !(f.kind === kind && f.id === id)),
  )
}

export function recordVisit(item: SavedItem): void {
  const now = Date.now()
  const without = loadHistory().filter(
    (h) => !(h.kind === item.kind && h.id === item.id),
  )
  const next: HistoryItem[] = [
    { ...item, visitedAt: now },
    ...without,
  ].slice(0, HISTORY_LIMIT)
  writeJson(HISTORY_KEY, next)
}

export function removeHistoryItem(kind: SavedKind, id: number): void {
  writeJson(
    HISTORY_KEY,
    loadHistory().filter((h) => !(h.kind === kind && h.id === id)),
  )
}

export function clearHistory(): void {
  writeJson(HISTORY_KEY, [])
}

export function clearFavorites(): void {
  writeJson(FAVORITES_KEY, [])
}

export function subscribeLibrary(onStoreChange: () => void): () => void {
  const onChange = () => onStoreChange()
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function favoritesSnapshot(): string {
  return JSON.stringify(loadFavorites())
}

export function historySnapshot(): string {
  return JSON.stringify(loadHistory())
}

export const KIND_LABEL: Record<SavedKind, string> = {
  regiao: 'Região',
  estado: 'Estado',
  municipio: 'Município',
}

export { itemKey }
