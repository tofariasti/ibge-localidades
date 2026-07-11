# Embed e white-label

Widget embutível (iframe) com chrome mínimo e parâmetros de marca na query string.

Demo (GitHub Pages): base `https://tofariasti.github.io/ibge-localidades/`.

Local (`npm run preview`): base `http://127.0.0.1:4173/`.

## Rotas do embed

| Rota | Conteúdo |
|------|----------|
| `/embed` | Mapa do Brasil (navegação ou indicador) |
| `/embed/estados/:id` | Detalhe compacto da UF |
| `/embed/municipios/:id` | Detalhe compacto do município |
| `/embed/regioes/:id` | Detalhe compacto da macrorregião |

No mapa, clique numa UF ou na legenda de região navega **dentro** do embed e preserva os parâmetros de marca. Use **Abrir no app** / **Abrir app** para a experiência completa em nova aba.

## Parâmetros de marca

| Param | Exemplo | Efeito |
|-------|---------|--------|
| `theme` | `light` ou `dark` | Tema (não grava no `localStorage` do visitante) |
| `accent` | `0d47a1` ou `#0d47a1` | Cor de destaque / header / links |
| `bg` | `f5f5f5` | Fundo da página |
| `text` | `212121` | Cor do texto |
| `brand` | `Meu Portal` | Nome no cabeçalho (máx. 48 caracteres) |
| `logo` | URL `https://…` | Imagem no cabeçalho (só `http:` / `https:`) |

Parâmetro do mapa (igual à Home): `mapa=indicador` ativa o coroplético de população.

## Exemplo iframe

```html
<iframe
  title="Mapa IBGE Localidades"
  src="https://tofariasti.github.io/ibge-localidades/embed?theme=light&accent=0d47a1&brand=Portal%20Exemplo&mapa=indicador"
  width="100%"
  height="560"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

Município:

```html
<iframe
  title="São Paulo — IBGE"
  src="https://tofariasti.github.io/ibge-localidades/embed/municipios/3550308?brand=Portal%20Exemplo&accent=1565c0"
  width="100%"
  height="420"
  loading="lazy"
></iframe>
```

Em build local (sem Pages), troque o prefixo por `/` (ex.: `http://127.0.0.1:4173/embed`).

## Boas práticas

- Altura sugerida: **520–600px** para o mapa; **400–480px** para detalhe.
- Não use `logo` com URLs não confiáveis; apenas HTTPS de origem própria.
- O rodapé do embed cita a API do IBGE; mantenha a atribuição ao republicar.
- Deep links do app completo (`/estados/:id`, `?q=`, etc.) continuam válidos fora do embed — veja o README.
