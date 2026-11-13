# Plataforma de Assistência Humanitária - Recife (Passarinho e Dois Carneiros)

Sistema completo desenvolvido para otimizar a logística pós-enchentes, conectando doadores, vítimas, ONGs parceiras e utilizando Inteligência Artificial para distribuição inteligente de recursos.

## 🚀 Como Rodar o Projeto na Sua Máquina (VS Code)

### Pré-requisitos
- **Node.js** (versão 18 ou superior recomendada) instalado.
- **Git** instalado.

---

### Passo 1: Executar o Backend (Servidor Node.js + API de IA)

1. Abra o terminal na raiz do projeto (`plataforma-humanitaria-recife`).
2. Instale as dependências do servidor:
   ```bash
   npm install
   ```
3. Inicie o servidor backend:
   ```bash
   npm run start
   ```
   *O servidor rodará em `http://localhost:5000`.*

---

### Passo 2: Executar o Frontend (React + Vite + Tailwind CSS)

1. Abra um **novo terminal** na raiz do projeto.
2. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
3. Instale as dependências do React:
   ```bash
   npm install
   ```
4. Inicie o ambiente de desenvolvimento Vite:
   ```bash
   npm run dev
   ```
5. Abra o link gerado no navegador (geralmente `http://localhost:5173`).

---

## 💡 Funcionalidades Principais para a Apresentação
1. **Módulo de Doadores**: Cadastro de ofertas de itens urgentes (colchões, cestas básicas, água, etc.) selecionando a ONG de destino.
2. **Estoque Total (Dashboard)**: Visualização em tempo real dos itens armazenados em cada ONG (Passarinho, Dois Carneiros, Ibura, etc.).
3. **Mapa de Arrecadação**: Pontos de coleta geolocalizados com rotas e horários.
4. **Inteligência Artificial de Distribuição**: Simulação de balanceamento automático do estoque global com base na urgência de cada ONG.
5. **Roadmap de Expansão**: Planejamento de rotas porta a porta mensais para famílias com mobilidade reduzida.
