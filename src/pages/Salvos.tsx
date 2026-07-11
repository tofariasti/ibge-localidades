import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { useFavorites, useVisitHistory } from '../hooks/useSavedLocalidades'
import { KIND_LABEL } from '../lib/savedLocalidades'

function formatVisitedAt(ts: number): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString('pt-BR')
  }
}

export function Salvos() {
  const { favorites, remove: removeFavorite, clear: clearFavorites } =
    useFavorites()
  const { history, remove: removeHistory, clear: clearHistory } =
    useVisitHistory()

  return (
    <section className="page">
      <h1>Salvos</h1>
      <p className="page__lead">
        Favoritos e histórico ficam neste navegador (`localStorage`). Não há
        sincronização entre dispositivos.
      </p>

      <h2>Favoritos</h2>
      {favorites.length === 0 ? (
        <EmptyState message="Nenhum favorito ainda. Use “Favoritar” no detalhe de região, estado ou município." />
      ) : (
        <>
          <div className="action-bar">
            <div className="action-bar__buttons">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  if (window.confirm('Remover todos os favoritos?')) {
                    clearFavorites()
                  }
                }}
              >
                Limpar favoritos
              </button>
            </div>
          </div>
          <ul className="saved-list">
            {favorites.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="saved-list__item">
                <div className="saved-list__meta">
                  <span className="saved-list__kind">
                    {KIND_LABEL[item.kind]}
                  </span>
                  <Link to={item.to} className="saved-list__link">
                    {item.label}
                  </Link>
                  <span className="saved-list__id">ID {item.id}</span>
                </div>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => removeFavorite(item.kind, item.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Histórico recente</h2>
      {history.length === 0 ? (
        <EmptyState message="Nenhuma consulta recente. Abra um detalhe de região, estado ou município." />
      ) : (
        <>
          <div className="action-bar">
            <div className="action-bar__buttons">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  if (window.confirm('Limpar todo o histórico?')) {
                    clearHistory()
                  }
                }}
              >
                Limpar histórico
              </button>
            </div>
          </div>
          <ul className="saved-list">
            {history.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="saved-list__item">
                <div className="saved-list__meta">
                  <span className="saved-list__kind">
                    {KIND_LABEL[item.kind]}
                  </span>
                  <Link to={item.to} className="saved-list__link">
                    {item.label}
                  </Link>
                  <span className="saved-list__id">
                    {formatVisitedAt(item.visitedAt)}
                  </span>
                </div>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => removeHistory(item.kind, item.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
