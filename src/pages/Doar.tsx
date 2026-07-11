import { useActionFeedback } from '../hooks/useActionFeedback'
import { copyToClipboard } from '../lib/clipboard'
import {
  DONATION_SUGGESTIONS_BRL,
  NUBANK_PIX_URL,
  PIX_CHAVE,
  PIX_COPIA_COLA,
} from '../data/donations'

export function Doar() {
  const { message, show } = useActionFeedback()

  async function copy(text: string, okMessage: string) {
    try {
      await copyToClipboard(text)
      show(okMessage)
    } catch {
      show('Não foi possível copiar')
    }
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&ecc=M&data=${encodeURIComponent(PIX_COPIA_COLA)}`

  return (
    <section className="page doar">
      <h1>Apoiar o projeto</h1>
      <p className="page__lead">
        O IBGE Localidades é gratuito e open source. Se a ferramenta te ajudou,
        uma doação via Pix ajuda a manter o projeto.
      </p>

      <p className="doar__hint">
        Qualquer valor. Sugestão: <strong>R$ 15</strong>
        {DONATION_SUGGESTIONS_BRL.filter((v) => v !== 15).map((v) => (
          <span key={v}> · R$ {v}</span>
        ))}
        .
      </p>

      <p className="doar__primary">
        <a
          className="button"
          href={NUBANK_PIX_URL}
          target="_blank"
          rel="noreferrer"
        >
          Doar com Pix (Nubank)
        </a>
      </p>

      <div className="doar__layout">
        <figure className="doar__qr">
          <img
            src={qrSrc}
            width={220}
            height={220}
            alt="QR Code Pix para doar ao IBGE Localidades"
          />
          <figcaption>Ou escaneie com o app do banco</figcaption>
        </figure>

        <div className="doar__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => copy(PIX_COPIA_COLA, 'Pix Copia e Cola copiado')}
          >
            Copiar Pix Copia e Cola
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => copy(PIX_CHAVE, 'Chave Pix copiada')}
          >
            Copiar chave Pix
          </button>
          {message && (
            <p className="action-bar__feedback" role="status" aria-live="polite">
              {message}
            </p>
          )}

          <details className="doar__payload">
            <summary>Ver código Pix Copia e Cola</summary>
            <pre className="doar__code">{PIX_COPIA_COLA}</pre>
          </details>
        </div>
      </div>

      <p className="doar__note">
        Doação voluntária ao mantenedor. O projeto não é afiliado ao IBGE.
      </p>
    </section>
  )
}
