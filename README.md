# IBGE Localidades

Frontend React (Vite + TypeScript) para consumir a [API de Localidades do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades).

Hierarquia do MVP: **Regiões → UFs → Municípios**.

**Demo:** [tofariasti.github.io/ibge-localidades](https://tofariasti.github.io/ibge-localidades/)

## Telas

### Página inicial

Mapa interativo em SVG (malha simplificada do IBGE): clique em qualquer UF para ir ao detalhe do estado; a legenda leva às macrorregiões.

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
| `/regioes` | Lista das 5 macrorregiões |
| `/regioes/:id` | Detalhe da região e UFs associadas |
| `/estados` | Lista de todas as UFs |
| `/estados/:id` | Detalhe da UF |
| `/estados/:id/municipios` | Municípios da UF |
| `/municipios/:id` | Detalhe do município |

## Exemplos de API (curl)

Base: `https://servicodados.ibge.gov.br/api/v1/localidades`

```bash
# Regiões
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes?orderBy=nome"

# Região Sudeste e seus estados
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes/3"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/regioes/3/estados?orderBy=nome"

# Estado São Paulo e municípios
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35"
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios?orderBy=nome"

# Município São Paulo (capital)
curl -s "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3550308"
```

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

## Kanban

Tarefas e user stories em [docs/KANBAN.md](docs/KANBAN.md).

## Commits

Um commit por user story concluída (Conventional Commits). Histórico:

1. `chore: bootstrap projeto React, Docker e Kanban`
2. `feat: cliente API IBGE localidades com tipos TypeScript`
3. `feat: layout, rotas e componentes base de UI`
4. `feat: telas de regiões com listagem e detalhe`
5. `feat: telas de unidades federativas`
6. `feat: telas de municípios por UF e detalhe`
7. `docs: polimento UI e documentação de uso`
