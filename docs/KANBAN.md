# Kanban — IBGE Localidades

Fluxo: uma US por vez. Commit ao concluir todas as tasks da US.

Ordem pós-MVP: **base → achar/exportar → hierarquia → análise → retenção → B2B**.

Priorização de valor (A/B/C) e prompt de discovery: [PRODUCT-VALUE.md](./PRODUCT-VALUE.md).

## Em progresso

_(nenhuma)_

## Backlog

### Fase 2 — Hierarquia territorial completa

#### US-15 — Regiões intermediárias e imediatas

- [ ] T15.1 Tipos e service (intermediárias / imediatas)
- [ ] T15.2 Telas de listagem e detalhe
- [ ] T15.3 Integração na navegação do município e da UF
- [ ] T15.4 Breadcrumb atualizado

#### US-16 — Países

- [ ] T16.1 Tipos e service `/paises`
- [ ] T16.2 Lista e detalhe de país
- [ ] T16.3 Entrada na Home / nav (secundária)

### Fase 3 — Contexto analítico

#### US-17 — Indicadores no detalhe

- [ ] T17.1 Escolher fonte estável (ex.: população/área via SIDRA ou endpoint disponível)
- [ ] T17.2 Painel de indicadores em `MunicipioDetail` e `EstadoDetail`
- [ ] T17.3 Loading/erro isolados do restante da página
- [ ] T17.4 Fonte e data da consulta visíveis (“dados IBGE”)

#### US-18 — Mapa coropleto

- [ ] T18.1 Camada de dados por UF (um indicador)
- [ ] T18.2 Escala de cores + legenda no `BrazilMap`
- [ ] T18.3 Toggle “navegação” vs “indicador” na Home
- [ ] T18.4 Tooltip com valor no hover

#### US-19 — Comparação de localidades

- [ ] T19.1 Selecionar 2 (até 3) municípios ou UFs
- [ ] T19.2 Tela `/comparar` lado a lado
- [ ] T19.3 Campos: códigos, hierarquia e indicadores disponíveis
- [ ] T19.4 Link compartilhável com IDs na query string

#### US-20 — Rankings simples

- [ ] T20.1 Ranking de municípios da UF por indicador (quando houver dado)
- [ ] T20.2 Ranking de UFs por indicador
- [ ] T20.3 Links do ranking para o detalhe

### Fase 4 — Retenção e polimento

#### US-21 — Favoritos e histórico

- [ ] T21.1 Favoritar região / UF / município (`localStorage`)
- [ ] T21.2 Página ou drawer de favoritos
- [ ] T21.3 Histórico das últimas consultas
- [ ] T21.4 Limpar histórico / remover favorito

#### US-22 — Compartilhar views com filtros

- [ ] T22.1 Sync busca/filtro com query string
- [ ] T22.2 Sync coropleto/indicador com query string
- [ ] T22.3 Botão “Copiar link desta view”

#### US-23 — PWA e mobile

- [ ] T23.1 Manifest + service worker básico
- [ ] T23.2 Ícones e nome instalável
- [ ] T23.3 Revisar layout touch (mapa, busca, listas longas)

#### US-24 — Glossário e acessibilidade

- [ ] T24.1 Página/glossário: código IBGE, meso/micro, imediata/intermediária
- [ ] T24.2 Revisar contraste, foco e `aria` na busca e no mapa
- [ ] T24.3 Preferência de tema (claro/escuro) se couber no design atual

#### US-25 — Testes E2E e CI

- [ ] T25.1 Playwright: fluxo Home → UF → município
- [ ] T25.2 Playwright: busca por código e export
- [ ] T25.3 Workflow CI (lint + build + e2e) no GitHub Actions

### Fase 5 — Monetização B2B (após tração)

#### US-26 — Conta e sync

- [ ] T26.1 Auth mínima (ou magic link)
- [ ] T26.2 Sync de favoritos e comparações
- [ ] T26.3 Relatórios salvos

#### US-27 — Embed e white-label

- [ ] T27.1 Widget embeddable (mapa ou detalhe)
- [ ] T27.2 Parâmetros de marca (cores / logo)
- [ ] T27.3 Documentação de integração

#### US-28 — Módulos IBGE adicionais

- [ ] T28.1 SIDRA avançado (séries temporais)
- [ ] T28.2 API de Nomes (módulo opcional)
- [ ] T28.3 Catálogo de módulos ativáveis por plano

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

### US-08 — Mapa interativo do Brasil

- [x] T8.1 Gerar malha SVG das UFs a partir da API de Malhas IBGE
- [x] T8.2 Componente `BrazilMap` com hover, teclado e navegação
- [x] T8.3 Integrar na Home, detalhe de UF e detalhe de região
- [x] T8.4 Legenda clicável por macrorregião

### US-09 — Cache e resiliência da API

- [x] T9.1 Cache em memória das listagens estáveis (regiões, UFs, municípios por UF)
- [x] T9.2 Persistência opcional em `localStorage` com TTL
- [x] T9.3 Retry no `ErrorMessage` / `useIbgeQuery`
- [x] T9.4 Empty state quando lista vier vazia

### US-10 — Busca global

- [x] T10.1 Índice/cliente de busca (nome, sigla UF, código IBGE)
- [x] T10.2 UI de busca no `Layout` (autocomplete + teclado)
- [x] T10.3 Navegação para detalhe (região / UF / município)
- [x] T10.4 Resultado mostra hierarquia (“Município → UF → Região”)

### US-11 — Filtro local em listagens

- [x] T11.1 Campo de filtro em `MunicipiosList`
- [x] T11.2 Campo de filtro em `EstadosList` e `RegioesList`
- [x] T11.3 Contagem de resultados filtrados

### US-12 — Copiar e exportar dados

- [x] T12.1 Botão “Copiar código IBGE” nos detalhes
- [x] T12.2 Botão “Copiar JSON” do recurso atual
- [x] T12.3 Export CSV da lista visível (municípios / estados / regiões)
- [x] T12.4 Export JSON da lista visível
- [x] T12.5 Feedback visual de cópia/export concluído

### US-13 — Transparência da API oficial

- [x] T13.1 Helper que monta a URL `servicodados.ibge.gov.br` da tela atual
- [x] T13.2 Botão “Ver na API” / “Copiar URL da API”
- [x] T13.3 Documentar no README o padrão de URLs

### US-14 — Mesorregiões e microrregiões

- [x] T14.1 Tipos e service (`mesorregioes`, `microrregioes`)
- [x] T14.2 Listagem e detalhe de mesorregião
- [x] T14.3 Listagem e detalhe de microrregião
- [x] T14.4 Links cruzados: UF ↔ meso ↔ micro ↔ município
- [x] T14.5 Breadcrumb atualizado
