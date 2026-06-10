import mapData from './brazilMap.generated.json'

export interface BrazilMapState {
  id: number
  sigla: string
  nome: string
  regiaoId: number
  path: string
  labelX: number
  labelY: number
}

export interface BrazilMapRegion {
  id: number
  sigla: string
  nome: string
}

export const BRAZIL_MAP_VIEWBOX = mapData.viewBox
export const BRAZIL_MAP_STATES = mapData.states as BrazilMapState[]
export const BRAZIL_MAP_REGIONS = mapData.regions as BrazilMapRegion[]

/** Cores por macrorregião (IDs IBGE: 1=N, 2=NE, 3=SE, 4=S, 5=CO). */
export const REGION_COLORS: Record<number, string> = {
  1: '#43a047',
  2: '#fb8c00',
  3: '#1e88e5',
  4: '#8e24aa',
  5: '#e53935',
}

export function getRegionName(regiaoId: number): string {
  return BRAZIL_MAP_REGIONS.find((r) => r.id === regiaoId)?.nome ?? ''
}
