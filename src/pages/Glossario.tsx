import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'

type GlossaryEntry = {
  term: string
  id: string
  body: string
}

const ENTRIES: GlossaryEntry[] = [
  {
    id: 'codigo-ibge',
    term: 'Código IBGE',
    body: 'Identificador numérico oficial da localidade na base do IBGE. Municípios usam 7 dígitos (ex.: 3550308 para São Paulo); UFs usam 1–2 dígitos (ex.: 35 para SP). É a chave estável para APIs, planilhas e integrações.',
  },
  {
    id: 'regiao',
    term: 'Macrorregião',
    body: 'Uma das cinco grandes regiões do Brasil (Norte, Nordeste, Centro-Oeste, Sudeste e Sul), usadas para agregações estatísticas e planeamento territorial em escala nacional.',
  },
  {
    id: 'uf',
    term: 'Unidade Federativa (UF)',
    body: 'Estado ou o Distrito Federal. Cada UF pertence a uma macrorregião e agrupa municípios, mesorregiões/microrregiões e regiões intermediárias/imediatas.',
  },
  {
    id: 'municipio',
    term: 'Município',
    body: 'Menor unidade político-administrativa com autonomia. O detalhe do município na API traz vínculos às duas hierarquias oficiais (meso/micro e intermediária/imediata).',
  },
  {
    id: 'mesorregiao',
    term: 'Mesorregião',
    body: 'Divisão intermediária entre UF e microrregião, definida pelo IBGE a partir de características físicas, econômicas e sociais semelhantes. Um estado contém várias mesorregiões.',
  },
  {
    id: 'microrregiao',
    term: 'Microrregião',
    body: 'Subdivisão da mesorregião, agrupando municípios vizinhos com maior interação socioeconômica. Todo município pertence a exatamente uma microrregião (hierarquia clássica).',
  },
  {
    id: 'intermediaria',
    term: 'Região intermediária',
    body: 'Nível da hierarquia atualizada (2017) entre UF e região imediata. Substitui, na prática analítica moderna, o papel das mesorregiões em muitos produtos estatísticos.',
  },
  {
    id: 'imediata',
    term: 'Região imediata',
    body: 'Agrupamento de municípios com um centro urbano de referência (emprego, serviços, deslocamentos diários). Equivale, na hierarquia nova, ao papel próximo das microrregiões.',
  },
  {
    id: 'm49',
    term: 'Código M49 / ISO',
    body: 'Na API de países, o IBGE usa o código M49 da ONU junto dos códigos ISO-ALPHA-2 e ISO-ALPHA-3 (ex.: Brasil = M49 76, BR, BRA).',
  },
  {
    id: 'censo-indicadores',
    term: 'Indicadores (Censo 2022)',
    body: 'Neste app, população, área e densidade vêm da API de Agregados (tabela 4714). São dados oficiais do Censo Demográfico 2022, com fonte e data da consulta exibidas nas telas.',
  },
]

export function Glossario() {
  return (
    <section className="page glossario">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Glossário' },
        ]}
      />
      <h1>Glossário</h1>
      <p className="page__lead">
        Termos usados na hierarquia territorial do IBGE e neste aplicativo. Para
        a documentação oficial da API, veja o{' '}
        <a
          href="https://servicodados.ibge.gov.br/api/docs/localidades"
          target="_blank"
          rel="noreferrer"
        >
          portal de Localidades
        </a>
        .
      </p>

      <nav className="glossario__toc" aria-label="Índice do glossário">
        <ul>
          {ENTRIES.map((entry) => (
            <li key={entry.id}>
              <a href={`#${entry.id}`}>{entry.term}</a>
            </li>
          ))}
        </ul>
      </nav>

      <dl className="glossario__list">
        {ENTRIES.map((entry) => (
          <div key={entry.id} className="glossario__item" id={entry.id}>
            <dt>{entry.term}</dt>
            <dd>{entry.body}</dd>
          </div>
        ))}
      </dl>

      <p>
        <Link to="/">← Voltar ao início</Link>
      </p>
    </section>
  )
}
