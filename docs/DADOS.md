# Fontes de dados (kit da organização)

Edital, regra 4: a solução usa **pelo menos uma base do kit** oferecido pela organização.
Edital, item 3 de "O que a organização prepara": dados de exemplo são permitidos **desde que identificados como fictícios**.

## Kit oficial

| Fonte | Endereço | O que oferece | Como usamos |
|---|---|---|---|
| Apac — Agência Pernambucana de Águas e Clima | https://apac.pe.gov.br | Chuva, rios, clima (PE) | Referência climática; endpoint `/api/sources` |
| Cemaden | https://www.cemaden.gov.br | Alertas de desastres naturais | Referência de risco (deslizamento/inundação) |
| Dados Abertos da Prefeitura do Recife | https://dados.recife.pe.gov.br | Bases municipais | Território/equipamentos (referência) |
| OpenStreetMap | https://www.openstreetmap.org | Mapas/geolocalização | **Consumido em tempo real** via Nominatim: `GET /api/geocode?q=` devolve lat/lng reais; `osmUrl` por ONG em `/api/data` |

## Dados do protótipo

- **Fictícios e identificados**: `dataNotice` em `GET /api/data`, aviso no rodapé da interface e nos nomes de exemplo ("fictício").
- Motivo: o protótipo roda sem banco de dados e sem credenciais de API nesta etapa; os dados fictícios permitem demonstrar o fluxo completo (oferta × necessidade × IA × estoque).
- **Caminho para produção**: substituir o banco em memória por integração com as APIs/bases acima + banco (ex.: PostgreSQL), mantendo os mesmos endpoints.

## OpenStreetMap — integração real (regra 4)

O protótipo não apenas lista o OpenStreetMap: ele consulta o serviço.

- **Serviço:** Nominatim, a geocodificação oficial do OpenStreetMap (`https://nominatim.openstreetmap.org/search`), com `format=jsonv2` e `limit=1`.
- **Endpoint nosso:** `GET /api/geocode?q=<endereço>` → `{ query, lat, lng, displayName, osmUrl, source }`.
- **Resiliência:** timeout de 4 s, `User-Agent` identificando a plataforma (exigência de uso do Nominatim) e cache em memória por consulta, para não repetir requisições.
- **Fallback honesto:** sem rede, a resposta usa as coordenadas de demonstração da ONG e marca `source: "fallback-coordenadas-demonstracao"`. A interface mostra o botão **OpenStreetMap** sempre com link válido.
- **Uso na tela:** cada ONG tem `osmUrl` (`https://www.openstreetmap.org/?mlat=..&mlon=..#map=16/..`) e o cadastro de doação mostra a localização do ponto de entrega.
- **Limite conhecido:** o Nominatim tem política de uso (~1 req/s). Em produção, o certo é geocodificar no cadastro e guardar as coordenadas no banco — o cache já evita repetição no protótipo.

## Endpoint de referência

`GET /api/sources` — retorna as fontes do kit com nome, URL e uso previsto (marcando `used: true` na base efetivamente consumida).
