/** Link Nubank “Cobrar” (Pix com valor livre). */
export const NUBANK_PIX_URL =
  'https://nubank.com.br/cobrar/1hezk0/6a52bcc1-36af-4741-8dd4-30f19cea975a'

/** Pix Copia e Cola (payload EMV) para doações ao mantenedor. */
export const PIX_COPIA_COLA =
  '00020126580014BR.GOV.BCB.PIX0136114a4eea-01e5-4656-af4c-6338a08c35a35204000053039865802BR592537.481.999 TIAGO OLIVEIRA6009SAO PAULO62140510wtiWXQqAIo63048891'

/** Chave Pix aleatória embutida no payload acima. */
export const PIX_CHAVE = '114a4eea-01e5-4656-af4c-6338a08c35a3'

export const DONATION_SUGGESTIONS_BRL = [15, 20, 50] as const
