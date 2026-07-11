import { useActionFeedback } from '../hooks/useActionFeedback'
import { copyToClipboard } from '../lib/clipboard'
import {
  downloadCsv,
  downloadJson,
  type CsvColumn,
} from '../lib/exportData'

type ListExportActionsProps<T> = {
  items: T[]
  filenameBase: string
  csvColumns: CsvColumn<T>[]
  apiUrl: string
}

export function ListExportActions<T>({
  items,
  filenameBase,
  csvColumns,
  apiUrl,
}: ListExportActionsProps<T>) {
  const { message, show } = useActionFeedback()

  async function handleCopyApiUrl() {
    try {
      await copyToClipboard(apiUrl)
      show('URL da API copiada')
    } catch {
      show('Não foi possível copiar')
    }
  }

  function handleCsv() {
    downloadCsv(`${filenameBase}.csv`, items, csvColumns)
    show('CSV exportado')
  }

  function handleJson() {
    downloadJson(`${filenameBase}.json`, items)
    show('JSON exportado')
  }

  return (
    <div className="action-bar">
      <div className="action-bar__buttons">
        <button type="button" className="button button--secondary" onClick={handleCsv}>
          Exportar CSV
        </button>
        <button type="button" className="button button--secondary" onClick={handleJson}>
          Exportar JSON
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
          onClick={handleCopyApiUrl}
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
