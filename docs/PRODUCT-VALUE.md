# Valor de produto — IBGE Localidades

Discovery de produto: o que aumenta o valor percebido de uma ferramenta **visual** para consultar dados oficiais do IBGE. Não é um plano de monetização (auth/billing); é roadmap de utilidade.

Kanban correspondente: [KANBAN.md](./KANBAN.md).

---

## Prompt melhorado (reutilizar em discovery)

```text
Você é um product strategist avaliando o projeto open-source IBGE Localidades
(https://tofariasti.github.io/ibge-localidades/), um frontend React que consulta
a API de Localidades do IBGE com navegação hierárquica (regiões → UFs → municípios)
e mapa interativo do Brasil.

Contexto do produto hoje:
- Dados: Localidades v1 (ao vivo) + malha de UFs (build-time)
- Já existe: listas/detalhes, mapa clicável, breadcrumbs, cache, retry, empty/error states
- Ainda não existe: busca, filtros, export, níveis meso/micro/imediata, indicadores SIDRA, favoritos, PWA

Objetivo:
Propor funcionalidades que aumentem o valor percebido para quem quer uma ferramenta
VISUAL para consultar dados oficiais do IBGE (não necessariamente “comprar” o código).

Público-alvo (priorizar nesta ordem):
1. Desenvolvedores / analistas que validam códigos e hierarquias IBGE
2. Estudantes / pesquisadores de geografia e dados públicos
3. Jornalistas / cidadãos que precisam achar um município ou entender a divisão territorial

Restrições:
- Priorize o que a API pública do IBGE já permite (Localidades, Malhas; SIDRA só se justificar)
- Diferencie: (A) must-have para ser útil no dia a dia, (B) diferencial competitivo, (C) nice-to-have
- Evite features genéricas de SaaS (auth, billing, multi-tenant) a menos que agreguem valor claro ao caso de uso

Entregue:
1. Lista priorizada de funcionalidades (A/B/C) com 1 frase de valor por item
2. Top 5 no formato: problema → feature → por que vende valor
3. O que NÃO construir agora (e por quê)
4. Critério de sucesso mensurável para as Top 5 (ex.: “achar município em <10s”)
```

### Variações úteis

- Trocar o público por um só (ex. só jornalistas) para um roadmap mais afiado.
- Acrescentar: “Compare com o portal oficial e com planilhas CSV — onde ganhamos?”
- Acrescentar: “Separe UI/UX de dados/API de distribuição (PWA, embed, CLI).”

---

## 1. Funcionalidades priorizadas (A / B / C)

### A — Must-have (útil no dia a dia)

| Feature | Valor | Kanban |
|---------|--------|--------|
| Busca global (nome ou código IBGE) | Acha município/UF sem navegar a árvore | US-10 |
| Filtros nas listas | Escala quando há milhares de municípios | US-11 |
| Copiar código / JSON | Ponte entre tela visual e integração técnica | US-12 |
| Export CSV/JSON da lista atual | Leva o dado para planilha ou script | US-12 |
| “Abrir / copiar URL oficial da API” | Transparência e confiança na fonte | US-13 |
| Hierarquia completa (meso, micro, intermediária, imediata) | Completa o modelo oficial que o detalhe já mostra só como texto | US-14, US-15 |

### B — Diferencial (proposta “visual + IBGE”)

| Feature | Valor | Kanban |
|---------|--------|--------|
| Mapa coroplético / malha mais fina | Consulta espacial, não só lista | US-18 |
| Comparar 2–3 localidades lado a lado | Decisão rápida sem abrir abas | US-19 |
| Query strings compartilháveis + favoritos/histórico | Reuso e compartilhamento de consultas | US-21, US-22 |
| Glossário IBGE (imediata vs micro, etc.) | Reduz barreira para não-especialistas | US-24 |
| Deep link estável por código | Embed em docs, tickets, artigos | US-22 |

### C — Nice-to-have / fase seguinte

| Feature | Valor | Kanban |
|---------|--------|--------|
| Indicadores SIDRA / rankings | Expande de “localidades” para socioeconômico — outro produto | US-17, US-20 |
| PWA offline com cache | Uso em campo / aulas | US-23 |
| Embed / widget | Distribuição B2B / blogs | US-27 |
| A11y + E2E | Qualidade e confiança, pouco “pitch” direto | US-24, US-25 |

```mermaid
flowchart LR
  mvp[MVP_mapa_hierarquia]
  must[A_busca_export_hierarquia]
  diff[B_mapa_compare_share]
  later[C_SIDRA_PWA_embed]
  mvp --> must --> diff --> later
```

---

## 2. Top 5 — problema → feature → valor

1. **Problema:** Achar um município exige região → UF → rolar lista.  
   **Feature:** Busca global por nome ou código IBGE.  
   **Valor:** Tempo de consulta cai de minutos para segundos; vira ferramenta diária.

2. **Problema:** Desenvolvedor vê o dado na UI mas não leva para código/planilha.  
   **Feature:** Copiar código/JSON + export CSV/JSON + link da API oficial.  
   **Valor:** Fecha o loop visual → integração; diferencial frente a “só olhar no site”.

3. **Problema:** Listas longas (milhares de municípios) sem filtro são inutilizáveis.  
   **Feature:** Filtro local nas listagens com contagem.  
   **Valor:** Navegação hierárquica continua viável após a busca.

4. **Problema:** Meso/micro/imediata aparecem só como texto no município.  
   **Feature:** Páginas e links da hierarquia territorial completa.  
   **Valor:** Cobertura oficial completa; útil para pesquisa e validação de códigos.

5. **Problema:** Portal oficial e CSV não dão mapa + hierarquia numa só vista.  
   **Feature:** Mapa + deep links compartilháveis (e depois comparação).  
   **Valor:** Pitch claro: “consultar IBGE com olho no mapa e link estável”.

---

## 3. O que NÃO construir agora

| Evitar | Por quê |
|--------|---------|
| Auth, sync em nuvem, billing | SaaS genérico; dilui o pitch antes de utilidade diária |
| Dashboard analítico genérico | Sem foco em códigos/hierarquia IBGE perde identidade |
| SIDRA completo | Outro produto; só depois de busca + export + hierarquia sólidos |
| White-label / embed | Distribuição B2B exige tração e API estável de views |

---

## 4. Critérios de sucesso (Top 5)

| Feature | Critério mensurável |
|---------|---------------------|
| Busca global | Usuário encontra município conhecido por nome ou código em **< 10 s** (do focus na busca ao detalhe) |
| Copiar / export / URL API | Em **1 clique** obtém código, JSON, CSV ou URL `servicodados.ibge.gov.br` válida |
| Filtro em listas | Filtrar municípios de uma UF por prefixo reduz a lista visível em **< 1 s** (client-side) |
| Hierarquia completa | De um município, navegar meso → micro (ou intermediária → imediata) sem sair do app |
| Mapa + deep link | Abrir `/municipios/:id` (ou UF/região) em aba anônima mostra o mesmo detalhe; Home → UF em **1 clique no mapa** |

---

## Próximo passo de implementação

Backlog da Fase 5 esgotado (US-26 adiada). Próximas ideias: retomar **US-26** (conta/sync) com tração, ou novas USs a partir do discovery em [PRODUCT-VALUE.md](./PRODUCT-VALUE.md).
