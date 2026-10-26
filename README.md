# Isca Rise Up · "Depois que o lead chega"

Páginas da isca digital da Rise Up Odonto: captura, guia, quiz e mini diagnóstico.
Os leads são gravados na base "Prospecção - Rise Up" do Notion.

## Páginas

| Endereço | O que é |
|---|---|
| `/` | Página de captura. Aceita `?c=RU-27` (código do lead da prospecção) e `?o=anuncio` (origem anúncio). Sem nenhum dos dois, a origem é Instagram. |
| `/guia` | Guia das 6 etapas |
| `/quiz` | Quiz de 8 perguntas. Sem cadastro, manda para a captura e volta para o quiz. |
| `/resultado?r=...` | Mini diagnóstico. O resultado é calculado a partir das respostas no próprio link. |

## Configuração na Vercel

Em **Settings > Environment Variables** (Configurações > Variáveis de ambiente):

- `NOTION_TOKEN`: chave secreta da integração "Isca Rise Up" do Notion
- `NOTION_DATABASE_ID`: `43d2b0cbdab14300a1893e9b8a648761`

A base precisa estar conectada à integração (no Notion: ··· > Conexões).

## Onde mudar cada coisa

- Link do botão "Agendar diagnóstico gratuito": `assets/config.js`
- Perguntas, regra de cálculo, textos do resultado e ferramentas: `assets/calc.js`
- Cores e visual: `assets/style.css`
