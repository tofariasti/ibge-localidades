import { expect, test } from '@playwright/test'

test.describe('Embed', () => {
  test('mapa com marca navega para UF preservando query', async ({ page }) => {
    await page.goto('/embed?brand=Portal%20Teste&accent=0d47a1')

    await expect(page.getByText('Portal Teste')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Mapa do Brasil' }),
    ).toBeVisible()

    await page.getByRole('link', { name: /São Paulo \(SP\)/i }).click()
    await expect(page).toHaveURL(/\/embed\/estados\/35/)
    await expect(page).toHaveURL(/brand=Portal(\+|%20)Teste/)
    await expect(
      page.getByRole('heading', { name: /São Paulo \(SP\)/ }),
    ).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('link', { name: 'Abrir no app' })).toBeVisible()
  })
})
