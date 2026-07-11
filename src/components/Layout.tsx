import { Link, Outlet } from 'react-router-dom'
import { GlobalSearch } from './GlobalSearch'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
  return (
    <div className="layout">
      <a href="#conteudo-principal" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="header">
        <Link to="/" className="logo">
          IBGE Localidades
        </Link>
        <GlobalSearch />
        <div className="header__tools">
          <nav aria-label="Principal">
            <Link to="/regioes">Regiões</Link>
            <Link to="/estados">Estados</Link>
            <Link to="/rankings">Rankings</Link>
            <Link to="/comparar">Comparar</Link>
            <Link to="/salvos">Salvos</Link>
            <Link to="/glossario">Glossário</Link>
            <Link to="/paises">Países</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main id="conteudo-principal" className="main" tabIndex={-1}>
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
        <span className="footer__sep" aria-hidden="true">
          ·
        </span>
        <Link to="/glossario">Glossário</Link>
        <span className="footer__sep" aria-hidden="true">
          ·
        </span>
        <Link to="/doar">Apoiar com Pix</Link>
      </footer>
    </div>
  )
}
