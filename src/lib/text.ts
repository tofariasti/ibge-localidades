/** Normaliza texto para busca/filtro (minúsculas, sem acentos). */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function matchesQuery(haystack: string, query: string): boolean {
  if (!query) return true
  return normalizeText(haystack).includes(normalizeText(query))
}
