export interface Regiao {
  id: number
  nome: string
  sigla: string
}

export interface UF {
  id: number
  nome: string
  sigla: string
  regiao: Regiao
}

export interface MesorregiaoRef {
  id: number
  nome: string
  UF: UF
}

export interface Microrregiao {
  id: number
  nome: string
  mesorregiao: MesorregiaoRef
}

export interface RegiaoIntermediariaRef {
  id: number
  nome: string
  UF: UF
}

export interface RegiaoImediata {
  id: number
  nome: string
  'regiao-intermediaria': RegiaoIntermediariaRef
}

export interface Municipio {
  id: number
  nome: string
  microrregiao?: Microrregiao
  'regiao-imediata'?: RegiaoImediata
}
