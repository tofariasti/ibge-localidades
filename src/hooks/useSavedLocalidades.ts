import { useCallback, useMemo, useSyncExternalStore } from 'react'
import {
  clearFavorites,
  clearHistory,
  favoritesSnapshot,
  historySnapshot,
  recordVisit,
  removeFavorite,
  removeHistoryItem,
  subscribeLibrary,
  toggleFavorite,
  type HistoryItem,
  type SavedItem,
  type SavedKind,
} from '../lib/savedLocalidades'

function parseFavorites(snap: string): SavedItem[] {
  try {
    const items = JSON.parse(snap) as SavedItem[]
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

function parseHistory(snap: string): HistoryItem[] {
  try {
    const items = JSON.parse(snap) as HistoryItem[]
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const snap = useSyncExternalStore(
    subscribeLibrary,
    favoritesSnapshot,
    () => '[]',
  )
  const favorites = useMemo(() => parseFavorites(snap), [snap])

  const isFavorite = useCallback(
    (kind: SavedKind, id: number) =>
      favorites.some((item) => item.kind === kind && item.id === id),
    [favorites],
  )

  const toggle = useCallback((item: SavedItem) => toggleFavorite(item), [])
  const remove = useCallback(
    (kind: SavedKind, id: number) => removeFavorite(kind, id),
    [],
  )
  const clear = useCallback(() => clearFavorites(), [])

  return { favorites, isFavorite, toggle, remove, clear }
}

export function useVisitHistory() {
  const snap = useSyncExternalStore(
    subscribeLibrary,
    historySnapshot,
    () => '[]',
  )
  const history = useMemo(() => parseHistory(snap), [snap])

  const track = useCallback((item: SavedItem) => recordVisit(item), [])
  const remove = useCallback(
    (kind: SavedKind, id: number) => removeHistoryItem(kind, id),
    [],
  )
  const clear = useCallback(() => clearHistory(), [])

  return { history, track, remove, clear }
}
