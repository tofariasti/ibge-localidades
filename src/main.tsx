import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import {
  applyTheme,
  readStoredTheme,
  resolveTheme,
} from './lib/theme'
import './index.css'

applyTheme(resolveTheme(readStoredTheme()))

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

if (!import.meta.env.VITE_DISABLE_SW) {
  registerSW({ immediate: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
