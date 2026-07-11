import type { Theme } from './theme'
import { applyTheme, readStoredTheme, resolveTheme } from './theme'

/** Query params de marca preservados entre rotas do embed. */
export const EMBED_BRAND_KEYS = [
  'theme',
  'accent',
  'bg',
  'text',
  'logo',
  'brand',
] as const

export type EmbedBrandKey = (typeof EMBED_BRAND_KEYS)[number]

export type EmbedBrand = {
  theme: Theme | null
  accent: string | null
  bg: string | null
  text: string | null
  logo: string | null
  brand: string | null
}

const STYLE_VARS = [
  '--color-accent',
  '--color-accent-hover',
  '--color-accent-ink',
  '--color-header-bg',
  '--color-link',
  '--color-bg',
  '--color-text',
] as const

function parseHex(raw: string | null): string | null {
  if (!raw) return null
  const cleaned = raw.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(cleaned) || /^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned}`
  }
  return null
}

function parseTheme(raw: string | null): Theme | null {
  if (raw === 'light' || raw === 'dark') return raw
  return null
}

function parseLogoUrl(raw: string | null): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.href
    }
  } catch {
    /* ignore */
  }
  return null
}

function parseBrandName(raw: string | null): string | null {
  if (!raw) return null
  const cleaned = Array.from(raw.trim())
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0
      return code >= 32 && code !== 127
    })
    .join('')
    .slice(0, 48)
  return cleaned || null
}

function lightenHex(hex: string, amount: number): string {
  const full =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex
  const n = Number.parseInt(full.slice(1), 16)
  const r = Math.min(255, ((n >> 16) & 255) + amount)
  const g = Math.min(255, ((n >> 8) & 255) + amount)
  const b = Math.min(255, (n & 255) + amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function parseEmbedBrand(
  searchParams: URLSearchParams,
): EmbedBrand {
  return {
    theme: parseTheme(searchParams.get('theme')),
    accent: parseHex(searchParams.get('accent')),
    bg: parseHex(searchParams.get('bg')),
    text: parseHex(searchParams.get('text')),
    logo: parseLogoUrl(searchParams.get('logo')),
    brand: parseBrandName(searchParams.get('brand')),
  }
}

/** Monta query string só com marca (+ extras opcionais, ex. mapa). */
export function buildEmbedQuery(
  searchParams: URLSearchParams,
  extra?: Record<string, string | null | undefined>,
): string {
  const next = new URLSearchParams()
  for (const key of EMBED_BRAND_KEYS) {
    const value = searchParams.get(key)
    if (value) next.set(key, value)
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value == null || value === '') next.delete(key)
      else next.set(key, value)
    }
  }
  const serialized = next.toString()
  return serialized ? `?${serialized}` : ''
}

export function embedPath(
  path: string,
  searchParams: URLSearchParams,
  extra?: Record<string, string | null | undefined>,
): string {
  const base = path.startsWith('/') ? path : `/${path}`
  return `${base}${buildEmbedQuery(searchParams, extra)}`
}

export function applyEmbedBrand(brand: EmbedBrand): void {
  const root = document.documentElement
  if (brand.theme) {
    applyTheme(brand.theme)
  }

  if (brand.accent) {
    root.style.setProperty('--color-accent', brand.accent)
    root.style.setProperty('--color-accent-hover', lightenHex(brand.accent, 24))
    root.style.setProperty('--color-accent-ink', brand.accent)
    root.style.setProperty('--color-header-bg', brand.accent)
    root.style.setProperty('--color-link', brand.accent)
  }
  if (brand.bg) {
    root.style.setProperty('--color-bg', brand.bg)
  }
  if (brand.text) {
    root.style.setProperty('--color-text', brand.text)
  }
}

export function clearEmbedBrand(): void {
  const root = document.documentElement
  for (const key of STYLE_VARS) {
    root.style.removeProperty(key)
  }
  applyTheme(resolveTheme(readStoredTheme()))
}

/** URL absoluta do app (fora do embed), respeitando basename do Pages. */
export function fullAppHref(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}` || normalized
}
