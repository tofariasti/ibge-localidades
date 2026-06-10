/**
 * Gera src/data/brazilMap.generated.json a partir da API de Malhas do IBGE.
 * Malha: países/BR com intrarregiao=UF (27 polígonos simplificados).
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../src/data/brazilMap.generated.json')

const UFS = {
  11: ['RO', 'Rondônia', 1],
  12: ['AC', 'Acre', 1],
  13: ['AM', 'Amazonas', 1],
  14: ['RR', 'Roraima', 1],
  15: ['PA', 'Pará', 1],
  16: ['AP', 'Amapá', 1],
  17: ['TO', 'Tocantins', 1],
  21: ['MA', 'Maranhão', 2],
  22: ['PI', 'Piauí', 2],
  23: ['CE', 'Ceará', 2],
  24: ['RN', 'Rio Grande do Norte', 2],
  25: ['PB', 'Paraíba', 2],
  26: ['PE', 'Pernambuco', 2],
  27: ['AL', 'Alagoas', 2],
  28: ['SE', 'Sergipe', 2],
  29: ['BA', 'Bahia', 2],
  31: ['MG', 'Minas Gerais', 3],
  32: ['ES', 'Espírito Santo', 3],
  33: ['RJ', 'Rio de Janeiro', 3],
  35: ['SP', 'São Paulo', 3],
  41: ['PR', 'Paraná', 4],
  42: ['SC', 'Santa Catarina', 4],
  43: ['RS', 'Rio Grande do Sul', 4],
  50: ['MS', 'Mato Grosso do Sul', 5],
  51: ['MT', 'Mato Grosso', 5],
  52: ['GO', 'Goiás', 5],
  53: ['DF', 'Distrito Federal', 5],
}

const REGIONS = {
  1: ['N', 'Norte'],
  2: ['NE', 'Nordeste'],
  3: ['SE', 'Sudeste'],
  4: ['S', 'Sul'],
  5: ['CO', 'Centro-Oeste'],
}

const URL =
  'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?qualidade=minima&intrarregiao=UF&formato=application/vnd.geo+json'

function* iterRings(geometry) {
  const { type, coordinates } = geometry
  if (type === 'Polygon') {
    for (const ring of coordinates) yield ring
  } else if (type === 'MultiPolygon') {
    for (const polygon of coordinates) {
      for (const ring of polygon) yield ring
    }
  }
}

function ringToPath(ring, project) {
  if (!ring.length) return ''
  const [x0, y0] = project(ring[0][0], ring[0][1])
  const parts = [`M${x0},${y0}`]
  for (let i = 1; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1])
    parts.push(`L${x},${y}`)
  }
  parts.push('Z')
  return parts.join('')
}

function centroid(geometry, project) {
  const lons = []
  const lats = []
  for (const ring of iterRings(geometry)) {
    for (const [lon, lat] of ring) {
      lons.push(lon)
      lats.push(lat)
    }
  }
  const [x, y] = project(
    (Math.min(...lons) + Math.max(...lons)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2,
  )
  return [x, y]
}

const res = await fetch(URL)
if (!res.ok) {
  throw new Error(`IBGE malhas: HTTP ${res.status}`)
}

const geo = await res.json()
const lons = []
const lats = []

for (const feature of geo.features) {
  for (const ring of iterRings(feature.geometry)) {
    for (const [lon, lat] of ring) {
      lons.push(lon)
      lats.push(lat)
    }
  }
}

const minLon = Math.min(...lons)
const maxLon = Math.max(...lons)
const minLat = Math.min(...lats)
const maxLat = Math.max(...lats)

const W = 800
const H = 900
const pad = 20

const project = (lon, lat) => {
  const x = pad + ((lon - minLon) / (maxLon - minLon)) * (W - 2 * pad)
  const y = pad + ((maxLat - lat) / (maxLat - minLat)) * (H - 2 * pad)
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100]
}

const states = geo.features
  .map((feature) => {
    const id = Number(feature.properties.codarea)
    const [sigla, nome, regiaoId] = UFS[id]
    const path = [...iterRings(feature.geometry)]
      .map((ring) => ringToPath(ring, project))
      .join(' ')
    const [labelX, labelY] = centroid(feature.geometry, project)
    return { id, sigla, nome, regiaoId, path, labelX, labelY }
  })
  .sort((a, b) => a.id - b.id)

const payload = {
  viewBox: `0 0 ${W} ${H}`,
  states,
  regions: Object.entries(REGIONS)
    .map(([id, [sigla, nome]]) => ({ id: Number(id), sigla, nome }))
    .sort((a, b) => a.id - b.id),
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
console.log(`Gerado ${OUT} (${states.length} estados)`)
