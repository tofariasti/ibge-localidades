import { useActionFeedback } from '../hooks/useActionFeedback'
import { copyToClipboard } from '../lib/clipboard'

type DetailActionsProps = {
  code: number | string
  resource: unknown
  apiUrl: string
}

export function DetailActions({ code, resource, apiUrl }: DetailActionsProps) {
  const { message, show } = useActionFeedback()

  async function copy(text: string, okMessage: string) {
    try {
      await copyToClipboard(text)
      show(okMessage)
    } catch {
      show('Não foi possível copiar')
    }
  }

  return (
    <div className="action-bar">
      <div className="action-bar__buttons">
        <button
          type="button"
          className="button button--secondary"
          onClick={() => copy(String(code), 'Código IBGE copiado')}
        >
          Copiar código IBGE
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={() =>
            copy(JSON.stringify(resource, null, 2), 'JSON copiado')
          }
        >
          Copiar JSON
        </button>
        <a
          className="button button--secondary"
          href={apiUrl}
          target="_blank"
          rel="noreferrer"
        >
          Ver na API
        </a>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => copy(apiUrl, 'URL da API copiada')}
        >
          Copiar URL da API
        </button>
      </div>
      {message && (
        <p className="action-bar__feedback" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}
