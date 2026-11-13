const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../server');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('API — Plataforma Humanitária Recife (edital: ≥3 testes no CI)', () => {
  test('GET /api/health retorna Online', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.status, 'Online');
    assert.ok(json.timestamp);
  });

  test('GET /api/data retorna doações, ONGs e inventário (com aviso de dados fictícios)', async () => {
    const res = await fetch(`${baseUrl}/api/data`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.donations) && json.donations.length > 0);
    assert.ok(Array.isArray(json.ngos) && json.ngos.length > 0);
    assert.ok(Array.isArray(json.inventory) && json.inventory.length > 0);
    assert.match(json.dataNotice, /fictícios/i);
  });

  test('GET /api/sources lista as fontes do kit de dados (Apac, Cemaden, Prefeitura, OSM)', async () => {
    const res = await fetch(`${baseUrl}/api/sources`);
    assert.equal(res.status, 200);
    const json = await res.json();
    const names = json.sources.map((s) => s.name).join(' ');
    assert.match(names, /Apac/);
    assert.match(names, /Cemaden/);
    assert.match(names, /Prefeitura do Recife/);
    assert.match(names, /OpenStreetMap/);
    for (const s of json.sources) assert.ok(s.url.startsWith('https://'));
  });

  test('POST /api/donations rejeita dados inválidos com 400', async () => {
    const res = await fetch(`${baseUrl}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donor: '', item: '', quantity: -1, ngo: 'ONG Inexistente' })
    });
    assert.equal(res.status, 400);
    const json = await res.json();
    assert.ok(Array.isArray(json.errors) && json.errors.length >= 3);
  });

  test('POST /api/donations cadastra doação válida e atualiza o estoque', async () => {
    const beforeRes = await fetch(`${baseUrl}/api/data`);
    const beforeJson = await beforeRes.json();
    const beforeTotal = beforeJson.inventory.reduce((acc, i) => acc + i.total, 0);

    const res = await fetch(`${baseUrl}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donor: 'Equipe de Teste (fictício)',
        item: 'Cestas Básicas',
        quantity: 10,
        ngo: beforeJson.ngos[0].name
      })
    });
    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.donation.quantity, 10);
    assert.equal(json.donation.status, 'Confirmado');

    const afterRes = await fetch(`${baseUrl}/api/data`);
    const afterJson = await afterRes.json();
    const afterTotal = afterJson.inventory.reduce((acc, i) => acc + i.total, 0);
    assert.equal(afterTotal, beforeTotal + 10);
  });

  test('POST /api/ai/optimize retorna alocações ordenadas com score e auditoria humana', async () => {
    const res = await fetch(`${baseUrl}/api/ai/optimize`, { method: 'POST' });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.allocations) && json.allocations.length > 0);
    for (const alloc of json.allocations) {
      assert.ok(typeof alloc.urgencyScore === 'number');
      assert.ok(alloc.urgencyScore >= 0 && alloc.urgencyScore <= 10);
      assert.ok(Array.isArray(alloc.factors));
      assert.ok(Array.isArray(alloc.suggestedItems));
    }
    // Ordenado por maior urgência primeiro
    const scores = json.allocations.map((a) => a.urgencyScore);
    const sorted = [...scores].sort((a, b) => b - a);
    assert.deepEqual(scores, sorted);
    assert.ok(json.audit && json.audit.humanDecision);
  });

  test('GET /api/indicator retorna o indicador de resultado definido no README', async () => {
    const res = await fetch(`${baseUrl}/api/indicator`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(typeof json.coveragePercent === 'number');
    assert.ok(json.coveragePercent >= 0 && json.coveragePercent <= 100);
    assert.ok(json.totalItems > 0);
  });
});
