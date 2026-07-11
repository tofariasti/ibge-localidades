# IBGE Localidades

Frontend React (Vite + TypeScript) para consumir a [API de Localidades do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades).

Hierarquia do MVP: **Regiões → UFs → Municípios**.

**Demo:** [tofariasti.github.io/ibge-localidades](https://tofariasti.github.io/ibge-localidades/)

## Apoie o projeto

Ferramenta gratuita e open source. Se for útil, você pode doar via **Pix** (qualquer valor; sugestão **R$ 15**):

- [Doar com Pix (Nubank)](https://nubank.com.br/cobrar/1hezk0/6a52bcc1-36af-4741-8dd4-30f19cea975a)
- No app: [Apoiar com Pix](https://tofariasti.github.io/ibge-localidades/doar) (QR Code e Copia e Cola)
- Chave Pix (aleatória): `114a4eea-01e5-4656-af4c-6338a08c35a3`

## Telas

### Página inicial

Mapa interativo em SVG (malha simplificada do IBGE): clique em qualquer UF para ir ao detalhe do estado; a legenda leva às macrorregiões. Na Home, alterne **Navegação** (cores por região) e **Indicador** (coroplético de população residente, Censo 2022).

![Mapa interativo do Brasil](docs/screenshots/mapa-brasil.png)

![Página inicial](docs/screenshots/home.png)

### Regiões

![Lista de regiões](docs/screenshots/regioes.png)

![Detalhe da região Sudeste](docs/screenshots/regiao-detalhe.png)

### Estados

![Lista de estados](docs/screenshots/estados.png)

![Detalhe do estado de São Paulo](docs/screenshots/estado-detalhe.png)

### Municípios

![Municípios de São Paulo](docs/screenshots/municipios.png)

![Detalhe do município de São Paulo](docs/screenshots/municipio-detalhe.png)

## Pré-requisitos

- Node.js 20+
- npm
- Docker e Docker Compose (opcional)

## Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

## Qualidade (lint, build, E2E)

```bash
npm run lint
npm run build
npm run test:e2e
```

Os testes E2E usam [Playwright](https://playwright.dev) (Chromium), sobem o `preview` após o build e consultam a API pública do IBGE (rede necessária). No CI, o workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda lint, build com `VITE_DISABLE_SW=true` (sem service worker) e os E2E.

Na primeira execução local, instale o browser:

```bash
npx playwright install chromium
```

## Docker

### Desenvolvimento (hot reload)

```bash
docker compose up
```

### Produção (build + nginx)

```bash
docker build -t ibge-localidades .
docker run -p 8080:80 ibge-localidades
```

Acesse http://localhost:8080

## GitHub Pages

A cada push na branch `main`, o workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica o build em:

**https://tofariasti.github.io/ibge-localidades/**

### Configuração no repositório

Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como fonte.

### Build local (mesmo ambiente do Pages)

```bash
npm run build:pages
npm run preview:pages
```

Acesse http://localhost:4173/ibge-localidades/

O build padrão (`npm run build`) continua com `base: /` para Docker e deploy em raiz.

## Rotas da aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com atalhos |
| `/doar` | Doação via Pix (Nubank, QR e Copia e Cola) |
| `/glossario` | Glossário de termos da hierarquia IBGE |
| `/regioes` | Lista das 5 macrorregiões |
| `/regioes/:id` | Detalhe da região e UFs associadas |
| `/estados` | Lista de todas as UFs |
| `/estados/:id` | Detalhe da UF |
| `/estados/:id/municipios` | Municípios da UF |
| `/estados/:id/mesorregioes` | Mesorregiões da UF |
| `/estados/:id/microrregioes` | Microrregiões da UF |
| `/estados/:id/regioes-intermediarias` | Regiões intermediárias da UF |
| `/estados/:id/regioes-imediatas` | Regiões imediatas da UF |
| `/mesorregioes/:id` | Detalhe da mesorregião e suas microrregiões |
| `/microrregioes/:id` | Detalhe da microrregião e seus municípios |
| `/regioes-intermediarias/:id` | Detalhe da intermediária e suas imediatas |
| `/regioes-imediatas/:id` | Detalhe da imediata e seus municípios |
| `/paises` | Lista de países e áreas |
| `/paises/:id` | Detalhe do país (código M49) |
| `/municipios/:id` | Detalhe do município |
| `/comparar` | Comparação lado a lado (query `ids`) |
| `/salvos` | Favoritos e histórico local |
| `/glossario` | Glossário de termos IBGE |
| `/rankings` | Hub de rankings (UFs e municípios) |
| `/rankings/ufs` | Ranking de UFs por indicador (query `indicador`) |
| `/rankings/municipios` | Escolha de UF para ranking municipal |
| `/rankings/municipios/:ufId` | Ranking de municípios da UF (query `indicador`) |

Na comparação, use `?ids=` com até 3 tokens separados por vírgula: `uf:35` (estado) ou `mun:3550308` (município). Ex.: `/comparar?ids=uf:35,mun:3304557`.

Nos rankings, use `?indicador=` com `populacao` (padrão), `area` ou `densidade` (Censo 2022).

Filtros de lista usam `?q=` (texto). Na Home, o mapa coroplético usa `?mapa=indicador`. Use **Copiar link desta view** para compartilhar a URL atual com esses parâmetros.
## Exemplos de API (curl)

Base: `https://servicodados.ibge.gov.br/api/v1/localidades`

Nas telas do app, **Ver na API** / **Copiar URL da API** montam a mesma URL via `buildIbgeApiUrl` (`src/api/ibgeClient.ts`).

| Tela | Path típico |
|------|-------------|
| Lista de regiões | `/regioes?orderBy=nome` |
| Detalhe de região | `/regioes/{id}` |
| Lista de estados | `/estados?orderBy=nome` |
| Detalhe de estado | `/estados/{id}` |
| Municípios da UF | `/estados/{id}/municipios?orderBy=nome` |
| Mesorregiões da UF | `/estados/{id}/mesorregioes?orderBy=nome` |
| Detalhe de mesorregião | `/mesorregioes/{id}` |
| Microrregiões da UF | `/estados/{id}/microrregioes?orderBy=nome` |
| Microrregiões da meso | `/mesorregioes/{id}/microrregioes?orderBy=nome` |
| Detalhe de microrregião | `/microrregioes/{id}` |
| Municípios da micro | `/microrregioes/{id}/municipios?orderBy=nome` |
| Intermediárias da UF | `/estados/{id}/regioes-intermediarias?orderBy=nome` |
| Detalhe de intermediária | `/regioes-intermediarias/{id}` |
| Imediatas da intermediária | `/regioes-intermediarias/{id}/regioes-imediatas?orderBy=nome` |
| Imediatas da UF | `/estados/{id}/regioes-imediatas?orderBy=nome` |
| Detalhe de imediata | `/regioes-imediatas/{id}` |
| Municípios da imediata | `/regioes-imediatas/{id}/municipios?orderBy=nome` |
| Lista de países | `/paises?orderBy=nome` |
| Detalhe de país (M49) | `/paises/{m49}` |
| Detalhe de município | `/municipios/{id}` |
| Todos os municípios (busca) | `/municipios?orderBy=nome` |

Indicadores demográficos (Censo 2022) usam a [API de Agregados v3](https://servicodados.ibge.gov.br/api/docs/agregados): tabela **4714** (população, área, densidade) em `N3` (UF) e `N6` (município).

| Tela | Agregado |
|------|----------|
| Indicadores da UF | `/4714/periodos/2022/variaveis/93\|6318\|614?localidades=N3[{id}]` |
| Indicadores do município | `/4714/periodos/2022/variaveis/93\|6318\|614?localidades=N6[{id}]` |
| População por UF (mapa) | `/4714/periodos/2022/variaveis/93?localidades=N3[all]` |
| Ranking UFs | `/4714/periodos/2022/variaveis/{93\|6318\|614}?localidades=N3[all]` |
| Ranking municípios da UF | `/4714/periodos/2022/variaveis/{93\|6318\|614}?localidades=N6[N3[{ufId}]]` |

```bash
# Regiões
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes?orderBy=nome"

# Região Sudeste e seus estados
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes/3"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes/3/estados?orderBy=nome"

# Estado São Paulo, municípios, mesorregiões e microrregiões
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios?orderBy=nome"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/mesorregioes?orderBy=nome"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/mesorregioes/3515/microrregioes?orderBy=nome"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/microrregioes/35061/municipios?orderBy=nome"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/regioes-intermediarias?orderBy=nome"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes-intermediarias/3501/regioes-imediatas?orderBy=nome"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes-imediatas/350001/municipios?orderBy=nome"

# Países (M49 do Brasil = 76)
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/paises?orderBy=nome" | head -c 200
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/paises/76"

# Município São Paulo (capital)
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3550308"

# Indicadores Censo 2022 (Agregados) — SP estado e capital
curl -s "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93%7C6318%7C614?localidades=N3%5B35%5D"
curl -s "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93%7C6318%7C614?localidades=N6%5B3550308%5D"
curl -s "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93?localidades=N3%5Ball%5D"
curl -s "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93?localidades=N6%5BN3%5B35%5D%5D" | head -c 400

# Todos os municípios (índice da busca global)
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome" | head -c 200
```

## Funcionalidades (Fase 1)

- **Busca global** no header (nome, sigla UF ou código IBGE) com hierarquia no resultado
- **Filtro local** nas listas de regiões, estados e municípios, com contagem
- **Copiar** código IBGE / JSON nos detalhes; **exportar** CSV/JSON da lista filtrada
- **Ver / copiar URL** da API oficial correspondente à tela
- **Indicadores** (população, área, densidade) no detalhe de UF e município — Censo 2022 via Agregados
- **Mapa coroplético** na Home (toggle navegação / indicador) com população por UF
- **Comparar** até 3 municípios ou UFs em `/comparar` (códigos, hierarquia, indicadores; link compartilhável via `?ids=`)
- **Salvos** em `/salvos`: favoritar região/UF/município e ver histórico recente (ambos em `localStorage`)
- **Links de view**: filtros (`?q=`), mapa (`?mapa=indicador`), rankings (`?indicador=`) e comparar (`?ids=`) — botão “Copiar link desta view”
- **PWA** instalável (manifest + service worker) com layout mobile aprimorado
- **Glossário** em `/glossario` e tema claro/escuro; skip link e melhorias de `aria`/foco na busca e no mapa
- **Rankings** de UFs e de municípios por UF (população, área ou densidade — Censo 2022), com link para o detalhe
## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (Docker / raiz) |
| `npm run build:pages` | Build para GitHub Pages |
| `npm run preview` | Preview do build |
| `npm run preview:pages` | Preview do build GitHub Pages |
| `npm run lint` | ESLint |
| `npm run generate:map` | Regenera `src/data/brazilMap.generated.json` via API de Malhas IBGE |

## Cache

Listagens estáveis (regiões, UFs, municípios por UF, UFs por região) usam cache em memória + `localStorage` (TTL 24h). Detalhes individuais sempre vão à API.

## PWA

O build de produção gera um Progressive Web App (`vite-plugin-pwa`):

- Manifest instalável (**IBGE Localidades** / short name **IBGE Local**)
- Service worker com atualização automática e fallback SPA
- Ícones em `public/pwa-192.png` e `public/pwa-512.png`

Após `npm run build` / `npm run build:pages`, o app pode ser instalado no dispositivo a partir do navegador (HTTPS ou localhost).

## Kanban e valor de produto

- Tarefas e user stories: [docs/KANBAN.md](docs/KANBAN.md)
- Prompt de discovery e priorização A/B/C: [docs/PRODUCT-VALUE.md](docs/PRODUCT-VALUE.md)

## Commits

Um commit por user story concluída (Conventional Commits). Histórico:

1. `chore: bootstrap projeto React, Docker e Kanban`
2. `feat: cliente API IBGE localidades com tipos TypeScript`
3. `feat: layout, rotas e componentes base de UI`
4. `feat: telas de regiões com listagem e detalhe`
5. `feat: telas de unidades federativas`
6. `feat: telas de municípios por UF e detalhe`
7. `docs: polimento UI e documentação de uso`
8. `feat: mapa interativo do Brasil (malha IBGE)`
9. `feat: cache, retry e empty state nas consultas IBGE`
10. `feat: busca global por nome, sigla e código IBGE`
11. `feat: filtro local e contagem nas listagens`
12. `feat: copiar e exportar CSV/JSON das consultas`
13. `feat: link e URL oficial da API IBGE nas telas`
14. `feat: mesorregiões e microrregiões com navegação cruzada`
15. `feat: regiões intermediárias e imediatas com navegação cruzada`
16. `feat: países com códigos M49/ISO e entrada na Home`
17. `feat: indicadores demográficos no detalhe de UF e município`
18. `feat: mapa coroplético de população por UF na Home`
19. `feat: comparação lado a lado de municípios e UFs`
20. `feat: rankings de UFs e municípios por indicador do Censo 2022`
21. `feat: favoritos e histórico local de consultas`
22. `feat: sincroniza filtros e mapa na URL para compartilhar views`
23. `feat: PWA instalável e ajustes de layout touch`
24. `feat: glossário, tema claro/escuro e melhorias de acessibilidade`
