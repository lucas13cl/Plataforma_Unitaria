# Recife Solidário — Plataforma Unitária de Assistência Humanitária (RMR)

> **Hackathon Antena na Lama — APONTI Academy: Devs Criam com IA**
> Solução com IA para ajudar a população da Região Metropolitana do Recife (RMR) a se preparar, se proteger e se recuperar de eventos climáticos extremos (chuvas fortes, alagamentos, deslizamentos de barreiras e calor intenso), cuidando de rios, mangues e encostas — começando por quem mais sofre, de modo útil para todos.

**Deploy público:** _preencher com a URL após o deploy (ver [docs/DEPLOY.md](docs/DEPLOY.md))_ — ex.: `https://plataforma-unitaria-recife.onrender.com`
**CI:** testes automatizados + build a cada push/PR (`.github/workflows/ci.yml`)

---

## 1. Problema

Na RMR, os eventos climáticos extremos estão cada vez mais frequentes. A informação de risco existe (Apac, Defesa Civil, Cemaden), mas muitas vezes chega tarde, em linguagem técnica e por canais que nem todos usam. Rios e canais entupidos de lixo, mangues aterrados e encostas desmatadas agravam o risco. E, quando a crise chega, a ajuda e a solidariedade se desorganizam: doadores não sabem onde entregar, ONGs não sabem o que falta, e famílias em Passarinho, Dois Carneiros e outras comunidades não recebem o item certo na hora certa.

**Pergunta do desafio:** como organizar a solidariedade depois da crise, para que doações, voluntários e necessidades se encontrem rápido, com linguagem simples e no celular de qualquer morador?

## 2. Caminho escolhido

**Caminho 3 — Mobilizar e recuperar (depois da crise)**
> *Como organizar a solidariedade e acelerar a recuperação?*

Um caminho, um fluxo (edital, regra 2). Os Caminhos 1 (prevenir) e 2 (alertar) não foram escolhidos: esta equipe entrega **um fluxo principal completo, de ponta a ponta**, no Caminho 3.

### Fluxo principal (ponta a ponta)

1. **ONG cadastra a necessidade** — cada ONG parceira (Passarinho, Dois Carneiros, Ibura) informa o que está precisando (água, colchões, cestas básicas, higiene…).
2. **Doador cadastra a oferta** — qualquer pessoa ou empresa cadastra o item, a quantidade e escolhe a ONG de destino (aba *Doadores & Ofertas*).
3. **A IA cruza oferta × necessidade e prioriza** — o módulo de IA calcula a urgência de cada ONG a partir das necessidades, do estoque disponível e das doações a caminho, e sugere o que enviar para onde (aba *Otimização com IA*).
4. **Estoque é atualizado** — a doação entra no inventário centralizado (aba *Estoque Centralizado*).
5. **Entrega e acompanhamento** — a ONG é localizada no mapa, com endereço, contato e rota (aba *Mapa & ONGs Próximas*), e o painel mostra o que já foi distribuído.
6. **Indicador acompanha o resultado** — a cobertura de itens urgentes é exibida em tempo real (`GET /api/indicator`).

## 3. Público: quem mais sofre, útil para todos

Pensada primeiro para a população da RMR mais exposta aos eventos climáticos — famílias de encostas e margens de rios em Passarinho, Dois Carneiros, Ibura e comunidades semelhantes — mas **qualquer morador consegue usar**: linguagem simples, funciona no celular, sem cadastro complicado. Públicos de apoio (opcional): Defesa Civil, associações de moradores, escolas, voluntários e visitantes.

## 4. Onde a IA foi usada — e corrigida (auditoria humana)

**Onde a IA entra (papel essencial, não decorativo — edital, regra 3):**
`POST /api/ai/optimize` — algoritmo de priorização que decide *o que enviar para qual ONG primeiro*.

**Como funciona (determinístico e auditável):**
- Score de urgência (0–10) por ONG = pesos das necessidades citadas (água +2, colchões +1,5, alimentos +1,5, fraldas/higiene +1, roupas/reparo +0,5) + bônus de escassez do estoque (disponível < 40% → +1,5; < 60% → +0,8) − alívio se já há doação a caminho (−0,5).
- Quantidade recomendada por item = função do estoque disponível e do score.
- A resposta traz `factors` (por que cada ponto foi somado), `inputsUsed` e `humanDecision`.

**Onde foi corrigida / limites (auditoria humana):**
- A primeira versão retornava uma resposta fixa, sem relação com os dados — **corrigida** para calcular a partir de necessidades, estoque e doações reais do sistema.
- A IA **não decide sozinha**: a recomendação é apoio à decisão; quem decide é a ONG, a Defesa Civil e as lideranças comunitárias. Isso está escrito na tela e na API (`audit.humanDecision`).
- Limitação conhecida: o score usa palavras-chave das necessidades cadastradas; necessidades descritas de forma muito diferente podem não ser reconhecidas. Mitigação: lista fechada de itens no formulário + revisão humana das recomendações.

## 5. Fontes de dados (kit da organização — regra 4)

| Fonte | Endereço | Uso na solução |
|---|---|---|
| Apac — Agência Pernambucana de Águas e Clima | [apac.pe.gov.br](https://apac.pe.gov.br) | Contexto de chuva/rios em Pernambuco |
| Cemaden — Centro Nacional de Monitoramento e Alertas de Desastres Naturais | [cemaden.gov.br](https://www.cemaden.gov.br) | Alertas de deslizamento/inundação |
| Dados Abertos da Prefeitura do Recife | [dados.recife.pe.gov.br](https://dados.recife.pe.gov.br) | Território e equipamentos municipais |
| OpenStreetMap | [openstreetmap.org](https://www.openstreetmap.org) | Geolocalização das ONGs e rotas — **consumido de verdade** |

Endpoints: `GET /api/sources` (lista as fontes com a base do kit destacada) e `GET /api/geocode?q=<endereço>`.

**Como o OpenStreetMap é usado de verdade:** o backend consulta o **Nominatim** (serviço oficial de geocodificação do OpenStreetMap, `nominatim.openstreetmap.org/search`) para transformar o endereço de cada ONG em coordenadas reais. A resposta inclui `lat`, `lng`, `displayName` e `osmUrl` (link direto para o ponto no openstreetmap.org). Os resultados ficam em cache em memória e há *fallback* para as coordenadas de demonstração se a rede estiver indisponível — nesse caso a API informa `source: "fallback-coordenadas-demonstracao"`, sem nunca inventar que consultou o mapa. Todo o painel de ONGs traz os botões **Google Maps** (rota) e **OpenStreetMap** (ponto).

**Dados operacionais do protótipo são fictícios** (criados para demonstração e identificados como tal na API e na tela), conforme permitido pelo edital.

## 6. Indicador de resultado

**Indicador:** *Cobertura de itens urgentes com estoque disponível* — percentual de itens do inventário com estoque disponível > 0.
**Meta do protótipo:** manter **≥ 80%** durante a operação.
**Onde ver:** `GET /api/indicator` e o **cartão "Cobertura de Itens Urgentes" no dashboard**, que mostra exatamente o mesmo número (nenhuma métrica decorativa na tela — os antigos valores fixos "94,2%" e "+42 doações" foram removidos justamente para o indicador ser auditável). No pitch, a equipe cadastra uma doação e mostra o indicador mudando em tempo real.

## 7. Validação com o usuário de verdade (Movimento Pró-Criança)

- **Sessão Da Lama ao Caos (Dia 1):** conversa com o validador sobre como chuva, calor, rio e barreiras aparecem na vida da comunidade. Registrar em [docs/VALIDACAO.md](docs/VALIDACAO.md).
- **Teste do protótipo (Dia 2, até 12h):** o validador usa a solução sem ajuda, enquanto a equipe observa onde travou.
- **O que mudou depois da conversa:** _preencher após a sessão, com exemplos concretos (ex.: linguagem simplificada, ordem das telas, novo campo no formulário). Não inventar: registrar o que realmente foi dito e alterado._

## 8. Alinhamento com os ODS

- **ODS 13** — Ação contra a Mudança Global do Clima (preparação/recuperação pós-eventos extremos)
- **ODS 11** — Cidades e Comunidades Sustentáveis (resiliência de comunidades da RMR)
- **ODS 6** — Água Potável e Saneamento (água e kits de higiene entre os itens priorizados)

## 9. Como rodar

### Pré-requisitos
- Node.js 18+ e npm
- Git

### Backend (Node.js + Express)
```bash
npm install
npm start          # http://localhost:5000  (health: /api/health)
```

### Frontend (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173  (/api encaminhado ao backend)
```

### Testes (≥ 3, edital regra 7)
```bash
npm test           # backend/tests/api.test.js — 7 testes (health, dados, fontes, validação, doação+estoque, IA, indicador)
```

### Build de produção
```bash
npm run build:frontend   # gera frontend/dist — o backend passa a servir o app na mesma origem
```

## 10. Deploy

Deploy em **serviço único no Render** (frontend + backend na mesma origem, sem CORS e sem URL hardcoded). Passo a passo completo em [docs/DEPLOY.md](docs/DEPLOY.md). Blueprint pronto em `render.yaml`. Alternativa: frontend na Vercel + backend no Render (definir `VITE_API_URL`).

## 11. Acessibilidade e mobile (regra 6)

- Layout responsivo (celular primeiro), navegação por abas com `role="tablist/tab"`, `aria-selected` e setas do teclado
- Link *Pular para o conteúdo*, `lang="pt-BR"`, `meta description`, labels associados a todos os campos (`htmlFor`/`id`)
- Contraste reforçado: textos de apoio em `slate-600` sobre branco (≥ 4,5:1, WCAG AA); verde/ciano usados só com variante escura para texto
- Tabelas com `<caption>` (oculto só visualmente) e `scope="col"` nos cabeçalhos, para leitores de tela
- Feedback dinâmico com `role="status"` + `aria-live="polite"` (cadastro de doação e resultado da IA são anunciados)
- Foco visível em todos os controles, linguagem simples e frases curtas em todas as telas

## 12. Estrutura do repositório

```
.
├── backend/
│   ├── server.js          # API (Express) + IA de priorização + serve o frontend em produção
│   └── tests/api.test.js  # testes automatizados (node:test)
├── frontend/
│   ├── src/App.jsx        # interface (React)
│   └── vite.config.js     # proxy /api em dev
├── docs/
│   ├── DEPLOY.md          # passo a passo do deploy
│   ├── PITCH.md           # roteiro do pitch de 3 minutos
│   ├── VALIDACAO.md       # registro da validação com o Movimento Pró-Criança
│   └── DADOS.md           # fontes de dados do kit
├── .github/workflows/ci.yml  # CI: testes + build
├── render.yaml            # blueprint do deploy (Render)
├── package.json           # scripts raiz (start, test, build)
└── README.md              # este arquivo (modelo do edital)
```

## 13. Conformidade regra a regra (Anexo V)

| # | Regra do edital | Como a solução cumpre | Onde comprovar |
|---|---|---|---|
| 1 | Foco em quem mais sofre, útil para todos | Famílias em áreas de risco da RMR atendidas por 4 ONGs; qualquer cidadão pode doar | Aba *ONGs* e texto da home |
| 2 | Um caminho, um fluxo completo | Caminho 3 — Mobilizar e recuperar: necessidade → oferta → IA → estoque → entrega → indicador | Seção 2 e abas do app |
| 3 | IA essencial, com decisão humana | `POST /api/ai/optimize` (score 0–10 com pesos, escassez e fatores) + `humanDecision` obrigatório | Seção 4, teste "IA ordenada e auditável" |
| 4 | Usar ao menos uma base do kit | OpenStreetMap via Nominatim (geocodificação real) + Apac/Cemaden/Dados Recife como contexto declarado | Seção 5, `GET /api/geocode`, `osmUrl` em `/api/data` |
| 5 | Validar com jovem do Movimento Pró-Criança | Roteiro de teste e registro de falas/ajustes | Seção 7 e [docs/VALIDACAO.md](docs/VALIDACAO.md) |
| 6 | Acessível de verdade | Skip link, tablist por teclado, contraste AA, `<caption>`/`scope`, `aria-live`, mobile first | Seção 11 |
| 7 | Deploy público + ≥3 testes no CI + README | Serviço único no Render, 10 testes no GitHub Actions, este README | Seção 10, badge/CI, `npm test` |
| 8 | Escopo aprovado pelo mentor no Dia 1 | Escopo do Caminho 3 registrado e reduzido a um fluxo | Seção 2 |

## 14. Checklist do code freeze (16h do Dia 2)

- [ ] Solução funcionando no celular, com deploy público
- [ ] Repositório com README preenchido nos campos do modelo (seções 1 a 7)
- [ ] Pelo menos 3 testes passando no CI (hoje: 10)
- [ ] Pitch de 3 minutos com demonstração (roteiro em [docs/PITCH.md](docs/PITCH.md))

## 15. Stack

React + Vite + Tailwind CSS (front) • Node.js + Express (back) • Sem banco de dados no protótipo (memória, dados fictícios identificados) • Deploy: Render • CI: GitHub Actions

---

*Inspiração: Caranguejos com Cérebro (Fred Zero Quatro, 1992) — "injetar um pouco de energia na lama". A antena (tecnologia) só faz sentido conectada ao território e a quem vive nele (a lama).*
