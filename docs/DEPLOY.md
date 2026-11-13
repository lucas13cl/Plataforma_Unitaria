# Deploy — Recife Solidário

Objetivo do edital: **deploy público** + **primeiro deploy até o fim do Dia 1**.

## Opção recomendada: serviço único no Render (frontend + backend)

Vantagens: uma só URL, sem CORS, sem `localhost` no código, `render.yaml` já pronto.

### Passo a passo (5 minutos)

1. Crie uma conta em [render.com](https://render.com) (pode entrar com GitHub).
2. No painel, clique em **New → Web Service**.
3. Escolha **Build and Deploy from a Blueprint** e selecione o repositório `lucas13cl/Plataforma_Unitaria`.
   - O Render lê o `render.yaml` da raiz e preenche: build, start e health check (`/api/health`).
4. Clique em **Create Web Service** e aguarde o primeiro deploy (2–4 min).
5. Copie a URL pública gerada (ex.: `https://plataforma-unitaria-recife.onrender.com`) e cole no README (seção *Deploy público*) e no pitch.
6. Teste: abra a URL no celular, cadastre uma doação de teste e rode a otimização com IA.

> Plano gratuito do Render "cai" (sleep) após inatividade e demora ~30–50s para acordar na primeira visita. Avise a banca ou deixe uma aba aberta antes do pitch.

### Como funciona em produção

- `npm --prefix frontend run build` gera `frontend/dist`.
- `node backend/server.js` serve a API **e** o `dist` na mesma porta (`PORT` do Render).
- O frontend chama `/api/...` relativo — nenhuma URL hardcoded.

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
