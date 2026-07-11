import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'

export function Rankings() {
  return (
    <section className="page rankings">
      <Breadcrumb
        items={[
          { label: 'Início', to: '/' },
          { label: 'Rankings' },
        ]}
      />
      <h1>Rankings</h1>
      <p className="page__lead">
        Compare UFs e municípios pelo Censo Demográfico 2022 (população, área ou
        densidade), com links para o detalhe de cada localidade.
      </p>

      <div className="home-cards">
        <Link to="/rankings/ufs" className="card">
          <h2>UFs</h2>
          <p>Ranking das 27 unidades federativas por indicador</p>
        </Link>
        <Link to="/rankings/municipios" className="card">
          <h2>Municípios</h2>
          <p>Ranking dos municípios de uma UF por indicador</p>
        </Link>
      </div>
    </section>
  )
}
