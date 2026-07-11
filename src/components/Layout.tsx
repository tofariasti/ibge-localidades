import { Link, Outlet } from 'react-router-dom'
import { GlobalSearch } from './GlobalSearch'

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          IBGE Localidades
        </Link>
        <GlobalSearch />
        <nav>
          <Link to="/regioes">Regiões</Link>
          <Link to="/estados">Estados</Link>
          <Link to="/paises">Países</Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <a
          href="https://servicodados.ibge.gov.br/api/docs/localidades"
          target="_blank"
          rel="noreferrer"
        >
          API IBGE — Localidades
        </a>
      </footer>
    </div>
  )
}
