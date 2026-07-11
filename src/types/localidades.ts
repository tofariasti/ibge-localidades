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

export interface Mesorregiao {
  id: number
  nome: string
  UF: UF
}

export interface Microrregiao {
  id: number
  nome: string
  mesorregiao: Mesorregiao
}

export interface RegiaoIntermediaria {
  id: number
  nome: string
  UF: UF
}

export interface RegiaoImediata {
  id: number
  nome: string
  'regiao-intermediaria': RegiaoIntermediaria
}

export interface Municipio {
  id: number
  nome: string
  microrregiao?: Microrregiao
  'regiao-imediata'?: RegiaoImediata
}

/** Códigos oficiais de país na API de Localidades. */
export interface CodigoPais {
  M49: number
  'ISO-ALPHA-2': string
  'ISO-ALPHA-3': string
}

export interface RegiaoMundo {
  id: { M49: number }
  nome: string
}

export interface SubRegiaoMundo {
  id: { M49: number }
  nome: string
  regiao: RegiaoMundo
}

export interface RegiaoIntermediariaMundo {
  id: { M49: number }
  nome: string
}

export interface Pais {
  id: CodigoPais
  nome: string
  'regiao-intermediaria': RegiaoIntermediariaMundo | null
  'sub-regiao': SubRegiaoMundo
}
