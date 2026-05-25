# Kanban — IBGE Localidades

Fluxo: uma US por vez. Commit ao concluir todas as tasks da US.

## Em progresso

_(nenhuma)_

## Backlog

### US-07 — Polimento e documentação

- [ ] T7.1 CSS global responsivo
- [ ] T7.2 README com mapa de rotas e curl
- [ ] T7.3 Atualizar este arquivo (US 01–06 em Concluído)

## Concluído

### US-01 — Fundação do projeto

- [x] T1.1 `git init`, `.gitignore`
- [x] T1.2 Scaffold Vite React TS
- [x] T1.3 `README.md`
- [x] T1.4 `docs/KANBAN.md`
- [x] T1.5 Docker (`Dockerfile`, `docker-compose.yml`, `.dockerignore`)
- [x] T1.6 Validar Docker dev e build prod

### US-02 — Cliente HTTP e tipos IBGE

- [ ] T2.1 `types/localidades.ts`
- [ ] T2.2 `api/ibgeClient.ts`
- [ ] T2.3 `api/localidadesService.ts`
- [ ] T2.4 `hooks/useIbgeQuery.ts`

### US-03 — Shell e roteamento

- [ ] T3.1 `react-router-dom`
- [ ] T3.2 `Layout`
- [ ] T3.3 `Loading`, `ErrorMessage`, `Breadcrumb`
- [ ] T3.4 `AppRoutes` + stubs
- [ ] T3.5 `Home`

### US-04 — Telas de Regiões

- [ ] T4.1 `RegioesList`
- [ ] T4.2 `RegiaoDetail`
- [ ] T4.3 Links região → UF
- [ ] T4.4 Loading e erro

### US-05 — Telas de UFs

- [ ] T5.1 `EstadosList`
- [ ] T5.2 `EstadoDetail`
- [ ] T5.3 Link municípios
- [ ] T5.4 Breadcrumb

### US-06 — Telas de Municípios

- [ ] T6.1 `MunicipiosList`
- [ ] T6.2 `MunicipioDetail`
- [ ] T6.3 Breadcrumb
- [ ] T6.4 Smoke fluxo completo

---

## US futuras (fora do MVP)

- Países, busca em municípios, meso/micro/regiões imediatas, E2E/CI
