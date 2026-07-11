export type ModuleId = 'indicadores' | 'series' | 'nomes'

/** “Plano” demonstrativo — sem billing; só organiza o catálogo. */
export type ModulePlan = 'livre' | 'analise'

export type ModuleDefinition = {
  id: ModuleId
  label: string
  description: string
  plan: ModulePlan
  /** Módulo sempre ativo (não desliga). */
  lockedOn?: boolean
  defaultOn: boolean
  href?: string
}

export const MODULE_CATALOG: ModuleDefinition[] = [
  {
    id: 'indicadores',
    label: 'Indicadores (Censo 2022)',
    description:
      'População, área e densidade no detalhe de UF e município — incluso no plano Livre.',
    plan: 'livre',
    lockedOn: true,
    defaultOn: true,
  },
  {
    id: 'series',
    label: 'Séries temporais (estimativas)',
    description:
      'População residente estimada ao longo dos anos (Agregados/SIDRA, tabela 6579) no detalhe.',
    plan: 'analise',
    defaultOn: false,
  },
  {
    id: 'nomes',
    label: 'API de Nomes',
    description:
      'Frequência e ranking de nomes por década e localidade (Censo 2010).',
    plan: 'analise',
    defaultOn: false,
    href: '/nomes',
  },
]

export const MODULE_PLAN_LABEL: Record<ModulePlan, string> = {
  livre: 'Livre',
  analise: 'Análise',
}

const STORAGE_KEY = 'ibge-modulos:v1'
const CHANGE_EVENT = 'ibge-modulos-change'

const OPTIONAL_IDS = MODULE_CATALOG.filter((m) => !m.lockedOn).map((m) => m.id)

function isModuleId(value: string): value is ModuleId {
  return MODULE_CATALOG.some((m) => m.id === value)
}

export function parseModulesParam(raw: string | null): ModuleId[] {
  if (!raw?.trim()) return []
  const seen = new Set<ModuleId>()
  for (const part of raw.split(/[,|]/)) {
    const id = part.trim().toLowerCase()
    if (isModuleId(id) && !seen.has(id)) seen.add(id)
  }
  return [...seen]
}

export function serializeModulesParam(ids: ModuleId[]): string {
  return ids.filter((id) => OPTIONAL_IDS.includes(id)).join(',')
}

export function readStoredModules(): ModuleId[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed.filter((id): id is ModuleId => typeof id === 'string' && isModuleId(id))
  } catch {
    return null
  }
}

export function defaultEnabledModules(): ModuleId[] {
  return MODULE_CATALOG.filter((m) => m.defaultOn || m.lockedOn).map((m) => m.id)
}

export function persistModules(ids: ModuleId[]): void {
  const optional = ids.filter((id) => OPTIONAL_IDS.includes(id))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(optional))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function subscribeModules(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(CHANGE_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function modulesSnapshot(): string {
  const stored = readStoredModules()
  const base = stored ?? defaultEnabledModules().filter((id) => OPTIONAL_IDS.includes(id))
  return base.slice().sort().join(',')
}

/**
 * Resolve módulos ativos: locked + storage (ou defaults) + query `modulos=`.
 * A query só acrescenta (útil para links compartilháveis), não remove locked.
 */
export function resolveEnabledModules(queryIds: ModuleId[]): Set<ModuleId> {
  const enabled = new Set<ModuleId>()
  for (const mod of MODULE_CATALOG) {
    if (mod.lockedOn) enabled.add(mod.id)
  }

  const stored = readStoredModules()
  const fromStorage =
    stored ??
    MODULE_CATALOG.filter((m) => m.defaultOn && !m.lockedOn).map((m) => m.id)

  for (const id of fromStorage) enabled.add(id)
  for (const id of queryIds) enabled.add(id)
  return enabled
}

export function isModuleEnabled(
  enabled: Set<ModuleId>,
  id: ModuleId,
): boolean {
  return enabled.has(id)
}

export function getModuleDefinition(id: ModuleId): ModuleDefinition {
  const found = MODULE_CATALOG.find((m) => m.id === id)
  if (!found) throw new Error(`Módulo desconhecido: ${id}`)
  return found
}
