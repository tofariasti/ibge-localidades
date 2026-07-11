import { useFavorites } from '../hooks/useSavedLocalidades'
import type { SavedKind } from '../lib/savedLocalidades'

type FavoriteButtonProps = {
  kind: SavedKind
  id: number
  label: string
  to: string
}

export function FavoriteButton({ kind, id, label, to }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(kind, id)

  return (
    <button
      type="button"
      className={
        active ? 'button button--secondary is-favorite' : 'button button--secondary'
      }
      aria-pressed={active}
      onClick={() => toggle({ kind, id, label, to })}
    >
      {active ? 'Remover dos favoritos' : 'Favoritar'}
    </button>
  )
}
