import { useEffect } from 'react'
import { useVisitHistory } from '../hooks/useSavedLocalidades'
import type { SavedKind } from '../lib/savedLocalidades'

type TrackVisitProps = {
  kind: SavedKind
  id: number
  label: string
  to: string
}

/** Registra a visita no histórico local ao montar / mudar o recurso. */
export function TrackVisit({ kind, id, label, to }: TrackVisitProps) {
  const { track } = useVisitHistory()

  useEffect(() => {
    track({ kind, id, label, to })
  }, [track, kind, id, label, to])

  return null
}
