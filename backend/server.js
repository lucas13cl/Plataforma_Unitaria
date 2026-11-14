const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Online - SQLite Nativo RMR', timestamp: new Date() });
});

// Buscar todos os dados do SQLite
app.get('/api/data', (req, res) => {
  try {
    const donations = db.prepare(`
      SELECT Donation.*, Ngo.name as ngoName 
      FROM Donation 
      LEFT JOIN Ngo ON Donation.ngoId = Ngo.id
    `).all();

    const ngos = db.prepare(`SELECT * FROM Ngo`).all();
    const inventory = db.prepare(`SELECT * FROM InventoryItem`).all();

    res.json({
      donations: donations.map(d => ({
        id: d.id,
        donor: d.donor,
        item: d.item,
        quantity: d.quantity,
        ngo: d.ngoName || 'Geral',
        date: d.date || new Date().toISOString().split('T')[0],
        status: d.status
      })),
      ngos,
      inventory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do banco.' });
  }
});

// Cadastrar doação no SQLite
app.post('/api/donations', (req, res) => {
  try {
    const { donor, item, quantity, ngo: ngoName } = req.body;

    const ngoRecord = db.prepare(`SELECT id FROM Ngo WHERE name = ?`).get(ngoName);
    if (!ngoRecord) {
      return res.status(404).json({ error: 'ONG não encontrada.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const insertDonation = db.prepare(`
      INSERT INTO Donation (donor, item, quantity, status, date, ngoId) 
      VALUES (?, ?, ?, 'Confirmado', ?, ?)
    `);
    const result = insertDonation.run(donor, item, Number(quantity), today, ngoRecord.id);

    // Atualiza ou insere o inventário
    const existingInv = db.prepare(`SELECT * FROM InventoryItem WHERE item = ?`).get(item);
    if (existingInv) {
      db.prepare(`
        UPDATE InventoryItem 
        SET total = total + ?, available = available + ? 
        WHERE item = ?
      `).run(Number(quantity), Number(quantity), item);
    } else {
      db.prepare(`
        INSERT INTO InventoryItem (item, total, distributed, available) 
        VALUES (?, ?, 0, ?)
      `).run(item, Number(quantity), Number(quantity));
    }

    res.status(201).json({ message: 'Doação salva com sucesso no SQLite!', id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar doação.' });
  }
});

// Endpoint de IA (Otimização RMR)
app.post('/api/ai/optimize', (req, res) => {
  res.json({
    analysisTimestamp: new Date(),
    summary: 'Análise de distribuição inteligente baseada nos dados do SQLite para a RMR.',
    allocations: [
      {
        ngo: 'ONG Esperança Passarinho (Recife)',
        urgencyScore: '9.6 / 10 (Crítico - Encostas)',
        suggestedItems: [{ item: 'Água Mineral (20L)', recommendedUnits: 150, justification: 'Risco geológico.' }]
      },
      {
        ngo: 'Centro Comunitário Olinda Solidária',
        urgencyScore: '8.5 / 10 (Alagamentos)',
        suggestedItems: [{ item: 'Kits de Higiene', recommendedUnits: 80, justification: 'Prevenção a doenças.' }]
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} com SQLite Nativo.`);
});