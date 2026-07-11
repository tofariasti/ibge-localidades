/** Escala sequencial azul para coroplético (baixo → alto). */
const CHOROPLETH_STOPS: Array<[number, number, number]> = [
  [227, 242, 253],
  [144, 202, 249],
  [66, 165, 245],
  [25, 118, 210],
  [13, 71, 161],
]

export function extent(values: number[]): { min: number; max: number } {
  if (values.length === 0) return { min: 0, max: 0 }
  let min = values[0]
  let max = values[0]
  for (const v of values) {
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Cor RGB para valor normalizado em [0, 1]. */
export function choroplethColor(t: number): string {
  const clamp = Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0
  const scaled = clamp * (CHOROPLETH_STOPS.length - 1)
  const i = Math.min(CHOROPLETH_STOPS.length - 2, Math.floor(scaled))
  const localT = scaled - i
  const [r1, g1, b1] = CHOROPLETH_STOPS[i]
  const [r2, g2, b2] = CHOROPLETH_STOPS[i + 1]
  const r = Math.round(lerp(r1, r2, localT))
  const g = Math.round(lerp(g1, g2, localT))
  const b = Math.round(lerp(b1, b2, localT))
  return `rgb(${r}, ${g}, ${b})`
}

export function valueToChoroplethColor(
  value: number | undefined,
  min: number,
  max: number,
): string {
  if (value == null || !Number.isFinite(value)) return '#cfd8dc'
  if (max <= min) return choroplethColor(0.5)
  return choroplethColor((value - min) / (max - min))
}

/** Stops da legenda (rótulo + cor), extremos e intermediários. */
export function choroplethLegendStops(
  min: number,
  max: number,
  steps = 5,
): Array<{ t: number; value: number; color: string }> {
  if (steps < 2) steps = 2
  const result: Array<{ t: number; value: number; color: string }> = []
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const value = min + (max - min) * t
    result.push({ t, value, color: choroplethColor(t) })
  }
  return result
}
