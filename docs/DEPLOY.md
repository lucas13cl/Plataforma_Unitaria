# Deploy — Recife Solidário

Objetivo do edital: **deploy público** + **primeiro deploy até o fim do Dia 1**.

## Opção recomendada: serviço único no Render (frontend + backend)

Vantagens: uma só URL, sem CORS, sem `localhost` no código, `render.yaml` já pronto.

### Deploy com Blueprint (recomendado — 1 clique)

O `render.yaml` já descreve build, start, health check e variáveis. Não é preciso digitar comando no painel.

1. Abra **<https://render.com/deploy?repo=https://github.com/lucas13cl/Plataforma_Unitaria>** e entre com GitHub.
2. Se aparecer, autorize o **Render GitHub App** no repositório `Plataforma_Unitaria` (permissão de leitura + webhooks).
3. O Render lê o `render.yaml` da raiz e mostra o serviço `plataforma-unitaria-recife` já configurado (Node, plano free, região Ohio, health check `/api/health`).
4. Clique em **Apply** / **Create Web Service**. O primeiro build leva 2–4 min.
5. Espere o status **Live** (o health check precisa responder 200).
6. Copie a URL pública e cole no README (seção 10) e no pitch.

> ⚠️ **Formato do `render.yaml`:** o Render exige a chave raiz `services:`. Um YAML com `name:` no topo (formato antigo) falha com *"Invalid Blueprint"*. Este repositório já está no formato correto.

### Se preferir criar o serviço à mão

| Campo do painel | Valor |
|---|---|
| Type | Web Service |
| Language / Runtime | Node |
| Branch | `main` |
| Region | Ohio |
| Build Command | `npm ci && npm --prefix frontend ci && npm --prefix frontend run build` |
| Start Command | `node backend/server.js` |
| Health Check Path | `/api/health` |
| Instance Type | Free |
| Env | `NODE_ENV=production` · `NODE_VERSION=22.22.3` |

`PORT` **não** deve ser definida: o Render injeta automaticamente e o backend já lê `process.env.PORT`.

### Problemas comuns

| Sintoma | Causa provável | Correção |
|---|---|---|
| *Invalid Blueprint* | YAML fora do formato `services:` | usar o `render.yaml` deste repositório |
| Build falha em `npm ci` | lockfile ausente/desatualizado | commit do `package-lock.json` (raiz e `frontend/`) |
| Página branca em `/` | `frontend/dist` não gerado | conferir o Build Command; o CI tem o job `smoke-producao` fazendo o mesmo caminho |
| `Cannot find module 'express'` | build e start em pastas diferentes | rodar `npm ci` na raiz (não dentro de `frontend`) |
| 404 em `/api/...` | serviço subiu como *Static Site* | recriar como **Web Service** |
| Demora ~50 s na 1ª visita | hibernação do plano free | abrir a URL antes do pitch e deixar carregada |

### Como funciona em produção

- `npm --prefix frontend run build` gera `frontend/dist`.
- `node backend/server.js` serve a API **e** o `dist` na mesma porta (`PORT` do Render).
- O frontend chama `/api/...` relativo — nenhuma URL hardcoded (`grep -r localhost frontend/dist` deve voltar vazio).
- `/api/health` é o health check: se não responder 200, o Render marca o deploy como falho.
- O job `smoke-producao` do CI roda exatamente esses comandos a cada push.

## Alternativa: Vercel (front) + Render (back)

1. Suba o backend no Render como acima (sem build do frontend, se preferir).
2. Na Vercel, importe `Plataforma_Unitaria`, defina **Root Directory = `frontend`**, build `npm run build`, output `dist`.
3. Defina a variável `VITE_API_URL` com a URL pública do backend (ex.: `https://seu-backend.onrender.com`) e faça novo deploy.
4. No backend, defina `CORS_ORIGIN` com a URL pública da Vercel.

## Verificação pós-deploy

- `GET /api/health` → `{"status":"Online",...}`
- `GET /api/data` → doações, ONGs, inventário
- `GET /api/sources` → fontes do kit (Apac, Cemaden, Prefeitura, OSM)
- `GET /api/indicator` → indicador de resultado
- `POST /api/ai/optimize` → alocações com score e auditoria
- Interface no celular: abas, formulário de doação, mapa das ONGs

## Variáveis de ambiente

| Variável | Onde | Valor |
|---|---|---|
| `PORT` | Render (automático) | porta do serviço |
| `NODE_ENV` | Render | `production` |
| `CORS_ORIGIN` | Render (opcional) | só se o front estiver em outro domínio |
| `VITE_API_URL` | Vercel (opcional) | só no deploy separado |
