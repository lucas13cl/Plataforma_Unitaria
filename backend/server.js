const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database para demonstração ágil na apresentação
let db = {
  donations: [
    { id: 1, donor: 'Supermercado Bompreço', item: 'Cestas Básicas', quantity: 150, ngo: 'ONG Esperança Passarinho', date: '2026-06-06', status: 'Confirmado' },
    { id: 2, donor: 'Loja Confiança Móveis', item: 'Colchões Solteiro', quantity: 40, ngo: 'Associação Dois Carneiros Unidos', date: '2026-06-05', status: 'Entregue' },
    { id: 3, donor: 'Empório Recife Solidário', item: 'Água Mineral (fardos 20L)', quantity: 200, ngo: 'Centro Comunitário Ibura', date: '2026-06-06', status: 'Em trânsito' }
  ],
  ngos: [
    { id: 1, name: 'ONG Esperança Passarinho', address: 'Av. Principal de Passarinho, 420 - Recife/PE', contact: '(81) 98877-6655', needs: 'Água, Colchões, Alimentos não perecíveis', lat: -7.9850, lng: -34.9120 },
    { id: 2, name: 'Associação Dois Carneiros Unidos', address: 'Rua da Paz, 128 - Jaboatão/Recife', contact: '(81) 99988-1122', needs: 'Fraldas, Cestas Básicas, Produtos de Limpeza', lat: -8.0830, lng: -34.9550 },
    { id: 3, name: 'Centro Comunitário Ibura', address: 'Ladeira do Tamandaré, 45 - Recife/PE', contact: '(81) 97711-3344', needs: 'Roupas infantis, Colchões, Colas e Telhas', lat: -8.1200, lng: -34.9350 }
  ],
  inventory: [
    { item: 'Cestas Básicas', total: 320, distributed: 180, available: 140 },
    { item: 'Colchões Solteiro', total: 95, distributed: 60, available: 35 },
    { item: 'Água Mineral (20L)', total: 540, distributed: 310, available: 230 },
    { item: 'Kits de Higiene', total: 180, distributed: 90, available: 90 }
  ]
};

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date() });
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
  
  // Atualiza estoque global simplificado
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

// Endpoint de Inteligência Artificial para Otimização de Distribuição
app.post('/api/ai/optimize', (req, res) => {
  // Simulação de algoritmo de IA baseado em carência e prioridade regional
  const aiRecommendation = {
    analysisTimestamp: new Date(),
    summary: 'Análise concluída com base na criticidade de Passarinho e Dois Carneiros.',
    allocations: [
      {
        ngo: 'ONG Esperança Passarinho',
        urgencyScore: '9.4 / 10 (Alta densidade de desabrigados)',
        suggestedItems: [
          { item: 'Água Mineral (20L)', recommendedUnits: 120, justification: 'Risco de contaminação e alta demanda por hidratação.' },
          { item: 'Colchões Solteiro', recommendedUnits: 25, justification: 'Perda total de dormitórios na encosta principal.' }
        ]
      },
      {
        ngo: 'Associação Dois Carneiros Unidos',
        urgencyScore: '8.8 / 10 (Área de difícil acesso por lama)',
        suggestedItems: [
          { item: 'Cestas Básicas', recommendedUnits: 90, justification: 'Estoque de alimentos perecíveis esgotado após interrupção de vias.' },
          { item: 'Kits de Higiene', recommendedUnits: 60, justification: 'Prevenção contra doenças de veiculação hídrica.' }
        ]
      },
      {
        ngo: 'Centro Comunitário Ibura',
        urgencyScore: '7.5 / 10',
        suggestedItems: [
          { item: 'Cestas Básicas', recommendedUnits: 50, justification: 'Suporte complementar a famílias periféricas.' }
        ]
      }
    ]
  };

  res.json(aiRecommendation);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - Plataforma Humanitária Recife`);
});
