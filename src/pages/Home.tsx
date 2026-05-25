import { Link } from 'react-router-dom'

export function Home() {
  return (
    <section className="page home">
      <h1>Localidades do Brasil</h1>
      <p>
        Explore a hierarquia geográfica oficial do IBGE: regiões, unidades
        federativas e municípios.
      </p>
      <div className="home-cards">
        <Link to="/regioes" className="card">
          <h2>Regiões</h2>
          <p>Norte, Nordeste, Centro-Oeste, Sudeste e Sul</p>
        </Link>
        <Link to="/estados" className="card">
          <h2>Estados</h2>
          <p>Todas as unidades federativas</p>
        </Link>
      </div>
    </section>
  )
}
