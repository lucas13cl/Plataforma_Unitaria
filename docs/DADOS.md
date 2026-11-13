# Fontes de dados (kit da organização)

Edital, regra 4: a solução usa **pelo menos uma base do kit** oferecido pela organização.
Edital, item 3 de "O que a organização prepara": dados de exemplo são permitidos **desde que identificados como fictícios**.

## Kit oficial

| Fonte | Endereço | O que oferece | Como usamos |
|---|---|---|---|
| Apac — Agência Pernambucana de Águas e Clima | https://apac.pe.gov.br | Chuva, rios, clima (PE) | Referência climática; endpoint `/api/sources` |
| Cemaden | https://www.cemaden.gov.br | Alertas de desastres naturais | Referência de risco (deslizamento/inundação) |
| Dados Abertos da Prefeitura do Recife | https://dados.recife.pe.gov.br | Bases municipais | Território/equipamentos (referência) |
| OpenStreetMap | https://www.openstreetmap.org | Mapas/geolocalização | lat/lng das ONGs e rotas (Google Maps usa as coordenadas) |

## Dados do protótipo

- **Fictícios e identificados**: `dataNotice` em `GET /api/data`, aviso no rodapé da interface e nos nomes de exemplo ("fictício").
- Motivo: o protótipo roda sem banco de dados e sem credenciais de API nesta etapa; os dados fictícios permitem demonstrar o fluxo completo (oferta × necessidade × IA × estoque).
- **Caminho para produção**: substituir o banco em memória por integração com as APIs/bases acima + banco (ex.: PostgreSQL), mantendo os mesmos endpoints.

## Endpoint de referência

`GET /api/sources` — retorna as fontes do kit com nome, URL e uso previsto.
