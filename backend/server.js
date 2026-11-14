const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Banco de dados em memória expandido para toda a Região Metropolitana do Recife (RMR)
let db = {
  donations: [
    { id: 1, donor: 'Supermercado Bompreço', item: 'Cestas Básicas', quantity: 150, ngo: 'ONG Esperança Passarinho (Recife)', date: '2026-06-06', status: 'Confirmado' },
    { id: 2, donor: 'Loja Confiança Móveis', item: 'Colchões Solteiro', quantity: 40, ngo: 'Associação Dois Carneiros (Jaboatão)', date: '2026-06-05', status: 'Entregue' },
    { id: 3, donor: 'Empório Recife Solidário', item: 'Água Mineral (fardos 20L)', quantity: 200, ngo: 'Centro Comunitário Olinda Solidária', date: '2026-06-06', status: 'Em trânsito' }
  ],
  ngos: [
    { id: 1, name: 'ONG Esperança Passarinho (Recife)', city: 'Recife', address: 'Av. Principal de Passarinho, 420 - Recife/PE', contact: '(81) 98877-6655', needs: 'Água, Colchões, Alimentos', lat: -7.9850, lng: -34.9120 },
    { id: 2, name: 'Associação Dois Carneiros (Jaboatão)', city: 'Jaboatão dos Guararapes', address: 'Rua da Paz, 128 - Jaboatão/PE', contact: '(81) 99988-1122', needs: 'Fraldas, Cestas Básicas, Limpeza', lat: -8.0830, lng: -34.9550 },
    { id: 3, name: 'Centro Comunitário Olinda Solidária', city: 'Olinda', address: 'Av. Brasil, 500 - Doce Doce - Olinda/PE', contact: '(81) 97711-3344', needs: 'Roupas infantis, Telhas, Cestas', lat: -8.0100, lng: -34.8550 },
    { id: 4, name: 'Ação Social Camaragibe', city: 'Camaragibe', address: 'Estrada de Aldeia, KM 2 - Camaragibe/PE', contact: '(81) 96655-4433', needs: 'Água Mineral, Colchões, Alimentos', lat: -7.9820, lng: -34.9830 },
    { id: 5, name: 'Rede Solidária São Lourenço', city: 'São Lourenço da Mata', address: 'Rua do Comercio, 89 - Centro - São Lourenço/PE', contact: '(81) 95544-3322', needs: 'Kits de Higiene, Alimentos', lat: -8.0010, lng: -35.0250 },
    { id: 6, name: 'Fundo Comunitário Paulista', city: 'Paulista', address: 'Av. Cláudio Gueiros Leite, 1500 - Janga - Paulista/PE', contact: '(81) 94433-2211', needs: 'Colchões, Água, Material de Limpeza', lat: -7.9350, lng: -34.8350 }
  ],
  inventory: [
    { item: 'Cestas Básicas', total: 650, distributed: 380, available: 270 },
    { item: 'Colchões Solteiro', total: 210, distributed: 120, available: 90 },
    { item: 'Água Mineral (20L)', total: 1040, distributed: 620, available: 420 },
    { item: 'Kits de Higiene', total: 400, distributed: 210, available: 190 }
  ]
};

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online - RMR', timestamp: new Date() });
});

app.get('/api/data', (req, res) => {
  res.json(db);
});

app.post('/api/donations', (req, res) => {
  const newDonation = {
    id: db.donations.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmado'
  };
  db.donations.push(newDonation);
  
  const existingInv = db.inventory.find(i => i.item.toLowerCase().includes(newDonation.item.toLowerCase()));
  if (existingInv) {
    existingInv.total += Number(newDonation.quantity);
    existingInv.available += Number(newDonation.quantity);
  } else {
    db.inventory.push({
      item: newDonation.item,
      total: Number(newDonation.quantity),
      distributed: 0,
      available: Number(newDonation.quantity)
    });
  }

  res.status(201).json({ message: 'Doação cadastrada com sucesso!', donation: newDonation });
});

// Endpoint de Inteligência Artificial para Otimização em Toda a RMR
app.post('/api/ai/optimize', (req, res) => {
  const aiRecommendation = {
    analysisTimestamp: new Date(),
    summary: 'Análise macroconcluída cobrindo os municípios críticos da Região Metropolitana do Recife (RMR).',
    allocations: [
      {
        ngo: 'ONG Esperança Passarinho (Recife)',
        urgencyScore: '9.6 / 10 (Crítico - Encostas)',
        suggestedItems: [
          { item: 'Água Mineral (20L)', recommendedUnits: 150, justification: 'Risco geológico e alta densidade populacional afetada.' },
          { item: 'Colchões Solteiro', recommendedUnits: 30, justification: 'Perda total de itens de dormitório.' }
        ]
      },
      {
        ngo: 'Associação Dois Carneiros (Jaboatão)',
        urgencyScore: '9.1 / 10 (Área de encosta isolada)',
        suggestedItems: [
          { item: 'Cestas Básicas', recommendedUnits: 110, justification: 'Interrupção temporária de vias de acesso por barreiras.' }
        ]
      },
      {
        ngo: 'Centro Comunitário Olinda Solidária (Olinda)',
        urgencyScore: '8.5 / 10 (Áreas alagadas de baixa cota)',
        suggestedItems: [
          { item: 'Kits de Higiene', recommendedUnits: 80, justification: 'Prevenção a surtos de leptospirose pós-enchente.' },
          { item: 'Água Mineral (20L)', recommendedUnits: 100, justification: 'Rede de abastecimento comprometida.' }
        ]
      },
      {
        ngo: 'Fundo Comunitário Paulista (Paulista)',
        urgencyScore: '7.9 / 10',
        suggestedItems: [
          { item: 'Cestas Básicas', recommendedUnits: 60, justification: 'Suporte a desabrigados temporários em escolas municipais.' }
        ]
      }
    ]
  };

  res.json(aiRecommendation);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - Plataforma Humanitária RMR`);
});