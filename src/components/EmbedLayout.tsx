import { useEffect } from 'react'
import { Link, Outlet, useSearchParams } from 'react-router-dom'
import { useEmbedBrand } from '../hooks/useEmbedBrand'
import {
  applyEmbedBrand,
  clearEmbedBrand,
  fullAppHref,
} from '../lib/embedBrand'

export function EmbedLayout() {
  const [searchParams] = useSearchParams()
  const brand = useEmbedBrand()

  useEffect(() => {
    applyEmbedBrand(brand)
    return () => {
      clearEmbedBrand()
    }
  }, [brand])

  const brandLabel = brand.brand ?? 'IBGE Localidades'
  const homeEmbed = `/embed${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  return (
    <div className="embed-layout">
      <a href="#embed-conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="embed-header">
        <Link to={homeEmbed} className="embed-header__brand">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brandLabel}
              className="embed-header__logo"
            />
          ) : null}
          <span className="embed-header__title">{brandLabel}</span>
        </Link>
        <a
          className="embed-header__open"
          href={fullAppHref('/')}
          target="_blank"
          rel="noreferrer"
        >
          Abrir app
        </a>
      </header>
      <main id="embed-conteudo" className="embed-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="embed-footer">
        <span>Dados: API de Localidades do IBGE</span>
        <span className="embed-footer__sep" aria-hidden="true">
          ·
        </span>
        <a href={fullAppHref('/')} target="_blank" rel="noreferrer">
          IBGE Localidades
        </a>
      </footer>
    </div>
  )
}
