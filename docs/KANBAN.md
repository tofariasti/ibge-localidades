# Kanban — IBGE Localidades

Fluxo: uma US por vez. Commit ao concluir todas as tasks da US.

## Em progresso

_(nenhuma)_

## Backlog

## US futuras (fora do MVP)

- Países (`/paises`)
- Busca textual em municípios
- Mesorregiões / microrregiões / regiões imediatas e intermediárias
- Testes E2E (Playwright) e CI

### US-08 — Mapa interativo do Brasil

- [x] T8.1 Gerar malha SVG das UFs a partir da API de Malhas IBGE
- [x] T8.2 Componente `BrazilMap` com hover, teclado e navegação
- [x] T8.3 Integrar na Home, detalhe de UF e detalhe de região
- [x] T8.4 Legenda clicável por macrorregião

## Concluído

### US-01 — Fundação do projeto

- [x] T1.1 `git init`, `.gitignore`
- [x] T1.2 Scaffold Vite React TS
- [x] T1.3 `README.md`
- [x] T1.4 `docs/KANBAN.md`
- [x] T1.5 Docker (`Dockerfile`, `docker-compose.yml`, `.dockerignore`)
- [x] T1.6 Validar Docker dev e build prod

### US-02 — Cliente HTTP e tipos IBGE

- [x] T2.1 `types/localidades.ts`
- [x] T2.2 `api/ibgeClient.ts`
- [x] T2.3 `api/localidadesService.ts`
- [x] T2.4 `hooks/useIbgeQuery.ts`

### US-03 — Shell e roteamento

- [x] T3.1 `react-router-dom`
- [x] T3.2 `Layout`
- [x] T3.3 `Loading`, `ErrorMessage`, `Breadcrumb`
- [x] T3.4 `AppRoutes` + stubs
- [x] T3.5 `Home`

### US-04 — Telas de Regiões

- [x] T4.1 `RegioesList`
- [x] T4.2 `RegiaoDetail`
- [x] T4.3 Links região → UF
- [x] T4.4 Loading e erro

### US-05 — Telas de UFs

- [x] T5.1 `EstadosList`
- [x] T5.2 `EstadoDetail`
- [x] T5.3 Link municípios
- [x] T5.4 Breadcrumb

### US-06 — Telas de Municípios

- [x] T6.1 `MunicipiosList`
- [x] T6.2 `MunicipioDetail`
- [x] T6.3 Breadcrumb
- [x] T6.4 Smoke fluxo completo

### US-07 — Polimento e documentação

- [x] T7.1 CSS global responsivo
- [x] T7.2 README com mapa de rotas e curl
- [x] T7.3 Atualizar este arquivo (US 01–06 em Concluído)
