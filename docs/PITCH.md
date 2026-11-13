# Pitch — 3 minutos (roteiro)

> **Deck interativo para projetar:** <https://plataforma-unitaria.onrender.com/pitch/> (ou [`pitch/index.html`](../pitch/index.html) offline) — 13 slides, cronômetro de 3:00, demo ao vivo e QR Code. Atalhos em [`pitch/README.md`](../pitch/README.md).
> Use este arquivo como **roteiro falado**; o deck é o que a banca vê.

> 20 equipes × 5 min (3 de apresentação + 2 de perguntas). Ensaie com cronômetro.
>
> **Aplicação no ar:** <https://plataforma-unitaria.onrender.com/> — **abra essa URL antes de começar** (o plano free hiberna e leva 30–50 s para acordar) e deixe a aba carregada.

## 0:00–0:30 — Problema (quem mais sofre)
"Na RMR, quando chove forte, quem mora em Passarinho e Dois Carneiros sofre primeiro: encosta, rio cheio, casa alagada. A ajuda existe, mas se desorganiza: doador não sabe onde entregar, ONG não sabe o que falta. Nós escolhemos o **Caminho 3: Mobilizar e recuperar**."

## 0:30–1:30 — Demonstração (fluxo ponta a ponta, no celular)
1. "Aqui está a ONG de Passarinho precisando de água e colchões."
2. "Um doador cadastra 50 cestas básicas em 20 segundos." *(cadastrar de verdade, com o app aberto em plataforma-unitaria.onrender.com)*
3. "O estoque atualiza na hora." *(aba Estoque)*
4. "Agora a IA: ela cruza necessidades, estoque e doações a caminho, e diz o que enviar para onde primeiro — com o motivo de cada ponto." *(aba Otimização com IA)*
5. "E o mapa mostra onde entregar, com contato e rota." *(aba Mapa)*

## 1:30–2:10 — IA com propósito + indicador
"A IA não é enfeite: sem ela, a distribuição é por ordem de chegada. Com ela, priorizamos quem está mais crítico. E ela não decide sozinha — a decisão final é humana. Nosso indicador: **cobertura de itens urgentes com estoque**, meta de 80%, medido em tempo real."

## 2:10–2:40 — Validação e acessibilidade
"Validamos com o jovem do Movimento Pró-Criança: [o que mudou — preencher após a sessão]. Tudo funciona no celular, com linguagem simples, contraste e navegação por teclado."

## 2:40–3:00 — Fechamento
"Recife Solidário: a antena conectada à lama. Doação certa, para quem mais precisa, na hora certa. Obrigado!"

## Perguntas prováveis da banca
- **Por que só o Caminho 3?** Um caminho, um fluxo completo — escopo aprovado com o mentor no Dia 1.
- **Os dados são reais?** Não: são fictícios e identificados como tal; as fontes do kit (Apac, Cemaden, Prefeitura, OSM) estão integradas como referência e o caminho para conectar é o endpoint `/api/sources`.
- **E se a IA errar?** O score é auditável (mostra os fatores) e a decisão final é humana.
- **Como mede resultado?** Indicador de cobertura (≥80%), visível em `/api/indicator` e no cartão do dashboard.
- **Onde está publicado?** <https://plataforma-unitaria.onrender.com/> — serviço único no Render (Node 22), deploy contínuo a cada merge na `main`.
- **Quais bases do kit vocês usaram?** OpenStreetMap de verdade (geocodificação via Nominatim em `/api/geocode`), com Apac, Cemaden e Dados Recife como referência declarada em `/api/sources`.
