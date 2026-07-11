/** TTL padrão: localidades mudam raramente. */
export const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000

const STORAGE_PREFIX = 'ibge-cache:v1:'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const memory = new Map<string, CacheEntry<unknown>>()

export function buildCacheKey(
  path: string,
  params?: Record<string, string>,
): string {
  if (!params || Object.keys(params).length === 0) return path
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return `${path}?${sorted}`
}

function isFresh<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  return Boolean(entry && entry.expiresAt > Date.now())
}

function readStorage<T>(key: string): CacheEntry<T> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return undefined
    return JSON.parse(raw) as CacheEntry<T>
  } catch {
    return undefined
  }
}

function writeStorage<T>(key: string, entry: CacheEntry<T>): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Quota / private mode — ignore persistence failure.
  }
}

function readMemory<T>(key: string): CacheEntry<T> | undefined {
  return memory.get(key) as CacheEntry<T> | undefined
}

function writeMemory<T>(key: string, entry: CacheEntry<T>): void {
  memory.set(key, entry)
}

export interface CachedFetchOptions {
  ttlMs?: number
  /** Persist to localStorage (default true for listagens). */
  persist?: boolean
}

/**
 * Returns cached value when fresh; otherwise runs `fetcher` and stores the result
 * in memory and optionally in localStorage.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedFetchOptions = {},
): Promise<T> {
  const ttlMs = options.ttlMs ?? DEFAULT_CACHE_TTL_MS
  const persist = options.persist ?? true

  const fromMemory = readMemory<T>(key)
  if (isFresh(fromMemory)) {
    return fromMemory.data
  }

  if (persist) {
    const fromStorage = readStorage<T>(key)
    if (isFresh(fromStorage)) {
      writeMemory(key, fromStorage)
      return fromStorage.data
    }
  }

  const data = await fetcher()
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs }
  writeMemory(key, entry)
  if (persist) writeStorage(key, entry)
  return data
}

/** Test/debug helper: clear memory and localStorage entries for this app. */
export function clearIbgeCache(): void {
  memory.clear()
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore
  }
}
