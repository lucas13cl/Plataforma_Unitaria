// backend/db.js
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Define o caminho do arquivo do banco SQLite leve
const dbPath = path.resolve(__dirname, '../prisma/dev.db');
const dbDir = path.dirname(dbPath);

// Garante que a pasta prisma existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializa a conexão com o SQLite nativo do Node.js
const database = new DatabaseSync(dbPath);

// Cria as tabelas do sistema humanitário caso elas não existam
database.exec(`
  CREATE TABLE IF NOT EXISTS Ngo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    contact TEXT NOT NULL,
    needs TEXT NOT NULL,
    lat REAL,
    lng REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Donation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor TEXT NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'Confirmado',
    date TEXT,
    ngoId INTEGER,
    FOREIGN KEY (ngoId) REFERENCES Ngo(id)
  );

  CREATE TABLE IF NOT EXISTS InventoryItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT UNIQUE NOT NULL,
    total INTEGER DEFAULT 0,
    distributed INTEGER DEFAULT 0,
    available INTEGER DEFAULT 0
  );
`);

module.exports = database;