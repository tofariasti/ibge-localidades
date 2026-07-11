interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  retrying?: boolean
}

export function ErrorMessage({
  message,
  onRetry,
  retrying = false,
}: ErrorMessageProps) {
  return (
    <div className="error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} disabled={retrying}>
          {retrying ? 'Tentando…' : 'Tentar novamente'}
        </button>
      )}
    </div>
  )
}
