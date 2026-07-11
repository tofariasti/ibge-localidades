import { expect, test } from '@playwright/test'

test.describe('Home → UF → município', () => {
  test('navega do mapa ao detalhe da UF e a um município', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'Localidades do Brasil' }),
    ).toBeVisible()

    await page.getByRole('link', { name: /São Paulo \(SP\)/i }).click()
    await expect(page).toHaveURL(/\/estados\/35/)
    await expect(
      page.getByRole('heading', { name: /São Paulo \(SP\)/ }),
    ).toBeVisible({ timeout: 30_000 })

    await page.getByRole('link', { name: 'Ver municípios' }).click()
    await expect(page).toHaveURL(/\/estados\/35\/municipios/)
    await expect(
      page.getByRole('heading', { name: /Municípios — São Paulo/ }),
    ).toBeVisible({ timeout: 30_000 })

    await page.getByLabel('Filtrar').fill('3550308')
    await page.getByRole('link', { name: '3550308' }).click()
    await expect(page).toHaveURL(/\/municipios\/3550308/)
    await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.getByText('3550308')).toBeVisible()
  })
})
