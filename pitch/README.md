# Pitch — apresentação de 3 minutos

Apresentação interativa da **Plataforma Unitária Recife Solidário** (Hackathon Antena na Lama — APONTI Academy, Anexo V).

Arquivo único e **offline-first**: `index.html`. Sem CDN, sem servidor, sem instalar nada.

## Link para apresentar

**<https://plataforma-unitaria.onrender.com/pitch/>** — servido pelo próprio backend, no mesmo domínio do app (o `render.yaml` publica a cada merge na `main`).

## Abrir localmente (ou offline)

```bash
# opção 1 — direto no navegador
open pitch/index.html      # macOS
xdg-open pitch/index.html  # Linux
start pitch\index.html     # Windows

# opção 2 — via servidor local (útil para o iframe do app ao vivo)
npx serve .                # depois abra http://localhost:3000/pitch/
```

## Atalhos

| Tecla | Ação |
|---|---|
| → / espaço | próximo slide |
| ← | slide anterior |
| Home / End | primeiro / último |
| **T** | inicia ou pausa o **cronômetro de 3:00** |
| **F** | tela cheia |
| **P** | imprimir ou salvar em **PDF** (reserva se o projetor falhar) |
| **?** | ajuda |
| swipe | no celular, deslize para os lados |

O cronômetro começa no primeiro avanço de slide: verde → amarelo (1 min) → vermelho (30 s). Se ele passar de **1:45** e a demo ainda não tiver começado, corte a fala do problema.

## Roteiro (3 min = ~430 palavras)

| Tempo | Slide | Ideia |
|---|---|---|
| 0:00–0:20 | 2 | Gancho: 140 mortes em maio/2022, 122 mil desalojados |
| 0:20–0:45 | 3 | A ajuda chega desorganizada |
| 0:45–1:45 | 5 | **Demo ao vivo** no celular (necessidade → doação → IA → mapa) |
| 1:45–2:15 | 6 e 7 | IA auditável + indicador ≥ 80% |
| 2:15–2:40 | 8 e 9 | Validação com o Pró-Criança + acessibilidade |
| 2:40–3:00 | 12 | Fechamento com QR na tela |

## QR Code

`qr-app.svg` e `qr-app.png` apontam para <https://plataforma-unitaria.onrender.com/>.
Estão embutidos no deck (capa, demo e fechamento) e o PNG aparece no README do GitHub.

Para regerar, se o domínio mudar:

```bash
pip install "qrcode[pil]"
python - <<'EOF'
import qrcode
URL = "https://plataforma-unitaria.onrender.com/"
qrcode.make(URL, box_size=12, border=2).save("pitch/qr-app.png")
EOF
```

E troque a URL no `index.html` (3 ocorrências) e no SVG.

## Slide 8 (validação) está com marcador

Os três cartões têm etiqueta **preencher**: são para as respostas do jovem do Movimento Pró-Criança (o que fez sozinho, onde travou, o que mudou). Preencha depois de rodar o roteiro de [`docs/VALIDACAO.md`](../docs/VALIDACAO.md) — o edital pede justamente essa história.

## Captura de tela como plano B

Se a internet do evento bloquear o iframe, salve um print do app em **`pitch/img/app.png`**. O botão *Ver captura* aparece sozinho no slide 5; sem o arquivo, ele simplesmente não é exibido.

## Compatibilidade

Funciona em Chrome, Edge, Firefox e Safari atuais. O app ao vivo exige internet; **todo o resto do deck funciona sem rede**.
