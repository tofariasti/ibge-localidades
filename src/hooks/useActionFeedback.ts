import { useCallback, useEffect, useRef, useState } from 'react'

/** Feedback temporário para ações de copiar/exportar. */
export function useActionFeedback(durationMs = 2000) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setMessage(null)
  }, [])

  const show = useCallback(
    (next: string) => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current)
      setMessage(next)
      timerRef.current = window.setTimeout(() => {
        setMessage(null)
        timerRef.current = null
      }, durationMs)
    },
    [durationMs],
  )

  useEffect(() => () => clear(), [clear])

  return { message, show, clear }
}
