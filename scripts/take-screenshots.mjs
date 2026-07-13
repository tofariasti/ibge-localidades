import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const baseURL = 'http://localhost:5173'
const screenshotsDir = join(__dirname, '..', 'docs', 'screenshots')

const screenshots = [
  {
    name: 'home.png',
    url: '/',
    description: 'Página inicial com cards',
  },
  {
    name: 'mapa-brasil.png',
    url: '/',
    description: 'Mapa interativo do Brasil',
    beforeScreenshot: async (page) => {
      // Scroll para o mapa
      await page.evaluate(() => {
        const map = document.querySelector('.home__map')
        if (map) {
          map.scrollIntoView({ behavior: 'instant', block: 'center' })
        }
      })
      await page.waitForTimeout(500)
    },
  },
  {
    name: 'regioes.png',
    url: '/regioes',
    description: 'Lista de regiões',
  },
  {
    name: 'regiao-detalhe.png',
    url: '/regioes/3',
    description: 'Detalhe da região Sudeste',
  },
  {
    name: 'estados.png',
    url: '/estados',
    description: 'Lista de estados',
  },
  {
    name: 'estado-detalhe.png',
    url: '/estados/35',
    description: 'Detalhe do estado de São Paulo',
  },
  {
    name: 'municipios.png',
    url: '/estados/35/municipios',
    description: 'Municípios de São Paulo',
  },
  {
    name: 'municipio-detalhe.png',
    url: '/municipios/3550308',
    description: 'Detalhe do município de São Paulo',
  },
]

async function takeScreenshots() {
  console.log('🚀 Iniciando captura de screenshots...\n')

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  try {
    for (const screenshot of screenshots) {
      console.log(`📸 Capturando: ${screenshot.name}`)
      console.log(`   URL: ${baseURL}${screenshot.url}`)

      await page.goto(`${baseURL}${screenshot.url}`, {
        waitUntil: 'networkidle',
      })

      // Aguardar animações
      await page.waitForTimeout(1000)

      // Executar ação customizada antes do screenshot
      if (screenshot.beforeScreenshot) {
        await screenshot.beforeScreenshot(page)
      }

      // Tirar screenshot
      await page.screenshot({
        path: join(screenshotsDir, screenshot.name),
        fullPage: false,
      })

      console.log(`   ✅ Salvo em: docs/screenshots/${screenshot.name}\n`)
    }

    console.log('🎉 Todos os screenshots foram capturados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao capturar screenshots:', error)
    throw error
  } finally {
    await browser.close()
  }
}

// Executar
takeScreenshots().catch((error) => {
  console.error(error)
  process.exit(1)
})
