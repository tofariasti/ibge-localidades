# IBGE Localidades

Frontend React (Vite + TypeScript) para consumir a [API de Localidades do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades).

Hierarquia do MVP: **Regiões → UFs → Municípios**.

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

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |

## Kanban

Tarefas e user stories em [docs/KANBAN.md](docs/KANBAN.md).

## API

Base: `https://servicodados.ibge.gov.br/api/v1/localidades`
