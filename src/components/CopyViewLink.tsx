import { useActionFeedback } from '../hooks/useActionFeedback'
import { copyToClipboard } from '../lib/clipboard'

type CopyViewLinkProps = {
  className?: string
  label?: string
}

/** Copia a URL atual (incluindo query string) para compartilhar a view. */
export function CopyViewLink({
  className = 'button button--secondary',
  label = 'Copiar link desta view',
}: CopyViewLinkProps) {
  const { message, show } = useActionFeedback()

  async function handleCopy() {
    try {
      await copyToClipboard(window.location.href)
      show('Link da view copiado')
    } catch {
      show('Não foi possível copiar')
    }
  }

  return (
    <span className="copy-view-link">
      <button type="button" className={className} onClick={handleCopy}>
        {label}
      </button>
      {message && (
        <span className="action-bar__feedback" role="status" aria-live="polite">
          {message}
        </span>
      )}
    </span>
  )
}
