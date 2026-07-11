import { expect, test } from '@playwright/test'

test.describe('Módulos', () => {
  test('ativa série temporal no detalhe da UF via query', async ({ page }) => {
    await page.goto('/estados/35?modulos=series')

    await expect(
      page.getByRole('heading', { name: /São Paulo \(SP\)/ }),
    ).toBeVisible({ timeout: 30_000 })
    await expect(
      page.getByRole('heading', { name: 'Série temporal' }),
    ).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText(/População residente estimada/i).first()).toBeVisible()
  })

  test('consulta frequência de nome com módulo na URL', async ({ page }) => {
    await page.goto('/nomes?modulos=nomes&nome=Maria&localidade=35')

    await expect(page.getByRole('heading', { name: 'Nomes no Brasil' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /MARIA/i })).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.getByRole('cell', { name: 'até 1930' })).toBeVisible()
  })
})
