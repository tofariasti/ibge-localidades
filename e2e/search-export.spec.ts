import { expect, test } from '@playwright/test'

test.describe('Busca e export', () => {
  test('busca município pelo código IBGE e abre o detalhe', async ({
    page,
  }) => {
    await page.goto('/')

    const search = page.getByRole('combobox', { name: /Buscar localidade/i })
    await search.click()
    await search.fill('3550308')

    const option = page.getByRole('option', { name: /São Paulo/i }).first()
    await expect(option).toBeVisible({ timeout: 60_000 })
    await option.click()

    await expect(page).toHaveURL(/\/municipios\/3550308/)
    await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible({
      timeout: 30_000,
    })
  })

  test('exporta CSV da lista de estados com filtro na URL', async ({
    page,
  }) => {
    await page.goto('/estados?q=S%C3%A3o')

    await expect(
      page.getByRole('heading', { name: 'Estados (UF)' }),
    ).toBeVisible()
    await expect(page.getByLabel('Filtrar')).toHaveValue('São')

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Exportar CSV' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/estados-ibge\.csv$/i)
    const failure = await download.failure()
    expect(failure).toBeNull()
  })
})
