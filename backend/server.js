const express = require('express');
const cors = require('cors');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: em produção, CORS_ORIGIN pode ser a URL pública do deploy (separadas por vírgula)
const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors(corsOrigins.length ? { origin: corsOrigins } : {}));
app.use(express.json());

/**
 * Banco em memória para demonstração no hackathon.
 * ATENÇÃO (edital, item "O que a organização prepara", nº 3):
 * os dados abaixo são FICTÍCIOS / de exemplo, criados para o protótipo,
 * e estão identificados como tal. Em produção, substituir por integração
 * com as fontes do kit (Apac, Cemaden, Dados Abertos da Prefeitura do
 * Recife, OpenStreetMap) — ver GET /api/sources e docs/DADOS.md.
 */
let db = {
  dataNotice: 'Dados fictícios de demonstração (protótipo de hackathon). Não representam registros reais.',
  donations: [
    { id: 1, donor: 'Supermercado Bompreço (fictício)', item: 'Cestas Básicas', quantity: 150, ngo: 'ONG Esperança Passarinho', date: '2026-06-06', status: 'Confirmado' },
    { id: 2, donor: 'Loja Confiança Móveis (fictício)', item: 'Colchões Solteiro', quantity: 40, ngo: 'Associação Dois Carneiros Unidos', date: '2026-06-05', status: 'Entregue' },
    { id: 3, donor: 'Empório Recife Solidário (fictício)', item: 'Água Mineral (fardos 20L)', quantity: 200, ngo: 'Centro Comunitário Ibura', date: '2026-06-06', status: 'Em trânsito' }
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

// Fontes do kit de dados oferecido pela organização (edital, regra 4)
const DATA_SOURCES = [
  { name: 'Apac — Agência Pernambucana de Águas e Clima', url: 'https://apac.pe.gov.br', use: 'Monitoramento de chuva, nível de rios e previsão climática em Pernambuco.', used: false },
  { name: 'Cemaden — Centro Nacional de Monitoramento e Alertas de Desastres Naturais', url: 'https://www.cemaden.gov.br', use: 'Alertas de deslizamento, inundação e chuva intensa.', used: false },
  { name: 'Dados Abertos da Prefeitura do Recife', url: 'https://dados.recife.pe.gov.br', use: 'Bases municipais de território, equipamentos e vulnerabilidade.', used: false },
  { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org', use: 'Geolocalização consumida de verdade via Nominatim (GET /api/geocode) e links de rota por ONG (osmUrl).', used: true,
    endpoints: ['GET /api/geocode?q=<endereço>', 'GET /api/data (campo osmUrl por ONG)'] }
];

// Palavras-chave de necessidade -> peso de urgência (base do score de IA)
const NEED_WEIGHTS = [
  { keywords: ['água', 'agua'], weight: 2.0, label: 'água/hidratação' },
  { keywords: ['colch'], weight: 1.5, label: 'colchões/dormitório' },
  { keywords: ['cesta', 'alimento', 'comida'], weight: 1.5, label: 'alimentos' },
  { keywords: ['fralda'], weight: 1.0, label: 'fraldas (bebês)' },
  { keywords: ['higiene', 'limpeza', 'desinfec'], weight: 1.0, label: 'higiene/limpeza' },
  { keywords: ['roupa', 'agasalho'], weight: 0.5, label: 'roupas' },
  { keywords: ['telha', 'cola'], weight: 0.5, label: 'reparo de moradia' }
];

function osmUrlFor(lat, lng) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

// Enriquece as ONGs com link de rota no OpenStreetMap (base do kit)
function ngosWithOsm(database) {
  return database.ngos.map((ngo) => ({ ...ngo, osmUrl: osmUrlFor(ngo.lat, ngo.lng) }));
}

function normalize(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function inventoryMatchesNeed(inventoryItem, needsText) {
  const item = normalize(inventoryItem);
  const needs = normalize(needsText);
  // Correspondência simples e auditável: substring nos dois sentidos
  return item.split(' ').some((word) => word.length > 3 && needs.includes(word)) || needs.split(' ').some((word) => word.length > 3 && item.includes(word));
}

/**
 * Algoritmo de priorização (IA com propósito — edital, regra 3).
 * Determinístico e explicável: qualquer pessoa pode auditar o cálculo.
 * score(0–10) = soma(pesos das necessidades citadas pela ONG)
 *             + bônus de escassez (estoque disponível baixo)
 *             − alívio se já há doação a caminho para aquela ONG
 * A recomendação NÃO decide sozinha: a decisão final é humana.
 */
function computeAllocations(database) {
  const allocations = database.ngos.map((ngo) => {
    const needsNorm = normalize(ngo.needs);
    let score = 0;
    const factors = [];

    for (const { keywords, weight, label } of NEED_WEIGHTS) {
      if (keywords.some((k) => needsNorm.includes(normalize(k)))) {
        score += weight;
        factors.push(`necessidade de ${label} (+${weight})`);
      }
    }

    const matchedInventory = database.inventory.filter((inv) => inventoryMatchesNeed(inv.item, ngo.needs));
    for (const inv of matchedInventory) {
      const ratio = inv.total > 0 ? inv.available / inv.total : 0;
      if (ratio < 0.4) {
        score += 1.5;
        factors.push(`escassez de ${inv.item}: só ${Math.round(ratio * 100)}% disponível (+1.5)`);
      } else if (ratio < 0.6) {
        score += 0.8;
        factors.push(`estoque moderado de ${inv.item}: ${Math.round(ratio * 100)}% disponível (+0.8)`);
      }
    }

    const incoming = database.donations.filter((d) => d.ngo === ngo.name && d.status === 'Em trânsito').length;
    if (incoming > 0) {
      score -= 0.5;
      factors.push(`já há ${incoming} doação(ões) a caminho (−0.5)`);
    }

    score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

    const suggestedItems = matchedInventory
      .filter((inv) => inv.available > 0)
      .map((inv) => {
        const recommendedUnits = Math.max(10, Math.min(inv.available, Math.ceil(inv.available * (score / 10) * 0.5)));
        return {
          item: inv.item,
          recommendedUnits,
          justification: `ONG cita "${ngo.needs}". Estoque disponível: ${inv.available} de ${inv.total} (${Math.round((inv.available / inv.total) * 100)}%).`
        };
      });

    return {
      ngo: ngo.name,
      urgencyScore: score,
      urgencyLabel: score >= 8 ? 'Crítica' : score >= 6 ? 'Alta' : score >= 4 ? 'Moderada' : 'Baixa',
      factors,
      suggestedItems
    };
  });

  // Maior urgência primeiro
  allocations.sort((a, b) => b.urgencyScore - a.urgencyScore);
  return allocations;
}

function computeIndicator(database) {
  const totalItems = database.inventory.length;
  const itemsWithStock = database.inventory.filter((i) => i.available > 0).length;
  const totalDonations = database.donations.length;
  const delivered = database.donations.filter((d) => d.status === 'Entregue').length;
  const coverage = totalItems ? Math.round((itemsWithStock / totalItems) * 100) : 0;
  return {
    name: 'Cobertura de itens urgentes com estoque disponível',
    description: 'Percentual de itens do inventário com estoque disponível > 0. Meta do protótipo: manter ≥ 80% durante a operação.',
    coveragePercent: coverage,
    itemsWithStock,
    totalItems,
    donationsTotal: totalDonations,
    donationsDelivered: delivered,
    note: 'Indicador calculado em tempo real a partir do estoque e das doações cadastradas (dados fictícios de demonstração).'
  };
}

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
  res.json({ ...db, ngos: ngosWithOsm(db) });
});

app.get('/api/sources', (req, res) => {
  res.json({ sources: DATA_SOURCES, usedSources: DATA_SOURCES.filter((s) => s.used).map((s) => s.name), note: 'Fontes do kit de dados da organização (edital, regra 4). Dados operacionais do protótipo são fictícios e identificados como tal.' });
});

// Geocodificação usando a base do kit: OpenStreetMap (Nominatim).
// Uso: GET /api/geocode?q=Av.%20Principal%20de%20Passarinho%2C%20420%20-%20Recife
// Se o serviço externo estiver indisponível, usa as coordenadas de demonstração
// da ONG correspondente (identificadas como fallback) — nunca quebra a demo.
const geocodeCache = new Map();
app.get('/api/geocode', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.status(400).json({ message: 'Parâmetro q (endereço) é obrigatório.', errors: ['q é obrigatório.'] });
  }
  if (geocodeCache.has(q)) return res.json(geocodeCache.get(q));

  // Fallback só quando o endereço/ONG consultado existe na base do protótipo.
  const qn = normalize(q);
  const qtokens = qn.split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
  const fallbackNgo = db.ngos.find((ngo) => {
    const name = normalize(ngo.name);
    const addr = normalize(ngo.address);
    return (
      (qn.length >= 5 && (addr.includes(qn) || name.includes(qn))) ||
      (name.length >= 5 && qn.includes(name)) ||
      qtokens.some((w) => addr.includes(w) || name.includes(w))
    );
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      { headers: { 'User-Agent': 'PlataformaUnitaria-Recife/1.0 (hackathon Antena na Lama)' }, signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!osmRes.ok) throw new Error(`Nominatim respondeu ${osmRes.status}`);
    const results = await osmRes.json();
    if (Array.isArray(results) && results.length > 0) {
      const lat = Number(results[0].lat);
      const lng = Number(results[0].lon);
      const payload = { query: q, lat, lng, displayName: results[0].display_name, osmUrl: osmUrlFor(lat, lng), source: 'openstreetmap-nominatim' };
      geocodeCache.set(q, payload);
      return res.json(payload);
    }
    throw new Error('Nenhum resultado no OpenStreetMap');
  } catch (err) {
    if (fallbackNgo) {
      const payload = { query: q, lat: fallbackNgo.lat, lng: fallbackNgo.lng, displayName: fallbackNgo.address, osmUrl: osmUrlFor(fallbackNgo.lat, fallbackNgo.lng), source: 'fallback-coordenadas-demonstracao' };
      geocodeCache.set(q, payload);
      return res.json(payload);
    }
    return res.status(502).json({ message: 'Não foi possível geocodificar o endereço agora. Tente novamente.', errors: [String(err.message || err)] });
  }
});

app.get('/api/indicator', (req, res) => {
  res.json(computeIndicator(db));
});

app.post('/api/donations', (req, res) => {
  const { donor, item, quantity, ngo } = req.body || {};
  const errors = [];
  if (!donor || typeof donor !== 'string' || !donor.trim()) errors.push('donor (nome do doador) é obrigatório.');
  if (!item || typeof item !== 'string' || !item.trim()) errors.push('item é obrigatório.');
  const qty = Number(quantity);
  if (!quantity || Number.isNaN(qty) || qty <= 0) errors.push('quantity deve ser um número maior que zero.');
  if (!ngo || !db.ngos.some((n) => n.name === ngo)) errors.push('ngo deve ser uma ONG cadastrada.');

  if (errors.length) {
    return res.status(400).json({ message: 'Dados inválidos.', errors });
  }

  const newDonation = {
    id: db.donations.length + 1,
    donor: donor.trim(),
    item: item.trim(),
    quantity: qty,
    ngo,
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmado'
  };
  db.donations.push(newDonation);

  // Atualiza estoque global simplificado
  const existingInv = db.inventory.find((i) => normalize(i.item).includes(normalize(newDonation.item)) || normalize(newDonation.item).includes(normalize(i.item)));
  if (existingInv) {
    existingInv.total += qty;
    existingInv.available += qty;
  } else {
    db.inventory.push({
      item: newDonation.item,
      total: qty,
      distributed: 0,
      available: qty
    });
  }

  res.status(201).json({ message: 'Doação cadastrada com sucesso!', donation: newDonation });
});

app.post('/api/ai/optimize', (req, res) => {
  const allocations = computeAllocations(db);
  res.json({
    analysisTimestamp: new Date().toISOString(),
    summary: 'Análise de priorização concluída a partir das necessidades cadastradas pelas ONGs, do estoque disponível e das doações a caminho.',
    allocations,
    audit: {
      method: 'Score de urgência (0–10) = pesos das necessidades citadas + bônus de escassez do estoque − alívio por doação a caminho. Cálculo determinístico e auditável.',
      inputsUsed: ['ngos.needs', 'inventory.available/total', 'donations.status'],
      humanDecision: 'Recomendação automática para apoio à decisão. A decisão final de distribuição é humana (ONG, Defesa Civil e lideranças comunitárias).'
    }
  });
});

// Em produção (deploy em serviço único), serve o frontend buildado.
// compression: o bundle sai ~56 kB gzip em vez de ~183 kB (importante em 3G/4G na favela).
app.use(compression());
app.disable('x-powered-by');
app.set('trust proxy', 1); // Render fica atrás de proxy: IP/protocolo corretos

// Deck do pitch (HTML interativo) — público em /pitch/ no mesmo domínio do app.
// Assim a apresentação tem URL estável (Render) e não depende de abrir arquivo local.
const pitchDir = path.join(__dirname, '..', 'pitch');
if (fs.existsSync(pitchDir)) {
  app.use('/pitch', express.static(pitchDir, {
    extensions: ['html'],
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=3600');
    },
  }));
}

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, {
    // Arquivos com hash no nome podem ficar em cache por 1 ano; o index nunca.
    setHeaders: (res, filePath) => {
      if (/[\\/]assets[\\/]/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em 0.0.0.0:${PORT} - Plataforma Humanitária Recife`);
  });
}

module.exports = { app, computeAllocations, computeIndicator, DATA_SOURCES };
