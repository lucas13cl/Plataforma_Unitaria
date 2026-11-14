// backend/init-db.js
const db = require('./db');

console.log('Populando banco SQLite nativo com ONGs da RMR...');

// Limpa dados anteriores
db.exec(`DELETE FROM Donation;`);
db.exec(`DELETE FROM Ngo;`);
db.exec(`DELETE FROM InventoryItem;`);

// Insere ONGs da RMR
const insertNgo = db.prepare(`
  INSERT INTO Ngo (name, city, address, contact, needs, lat, lng) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertNgo.run('ONG Esperança Passarinho (Recife)', 'Recife', 'Av. Principal de Passarinho, 420 - Recife/PE', '(81) 98877-6655', 'Água, Colchões, Alimentos', -7.9850, -34.9120);
insertNgo.run('Associação Dois Carneiros (Jaboatão)', 'Jaboatão dos Guararapes', 'Rua da Paz, 128 - Jaboatão/PE', '(81) 99988-1122', 'Fraldas, Cestas Básicas, Limpeza', -8.0830, -34.9550);
insertNgo.run('Centro Comunitário Olinda Solidária', 'Olinda', 'Av. Brasil, 500 - Olinda/PE', '(81) 97711-3344', 'Roupas infantis, Telhas, Cestas', -8.0100, -34.8550);
insertNgo.run('Ação Social Camaragibe', 'Camaragibe', 'Estrada de Aldeia, KM 2 - Camaragibe/PE', '(81) 96655-4433', 'Água Mineral, Colchões', -7.9820, -34.9830);

// Insere Estoque Inicial
const insertInv = db.prepare(`
  INSERT INTO InventoryItem (item, total, distributed, available) 
  VALUES (?, ?, ?, ?)
`);

insertInv.run('Cestas Básicas', 650, 380, 270);
insertInv.run('Colchões Solteiro', 210, 120, 90);
insertInv.run('Água Mineral (20L)', 1040, 620, 420);
insertInv.run('Kits de Higiene', 400, 210, 190);

console.log('Banco SQLite populado com sucesso!');