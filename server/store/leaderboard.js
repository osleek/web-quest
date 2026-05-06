const path = require('path');
const initSqlJs = require('sql.js');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'leaderboard.db');

let db = null;

async function initLeaderboard() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      operatorName TEXT NOT NULL,
      score       INTEGER NOT NULL DEFAULT 0,
      elapsedTime INTEGER NOT NULL DEFAULT 0,
      completedAt TEXT NOT NULL
    );
  `);

  _save();
  return db;
}

function _save() {
  if (!db) return;
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (e) {
    console.error('Leaderboard save error:', e.message);
  }
}

function addEntry({ operatorName, score, elapsedTime }) {
  if (!db) throw new Error('Leaderboard not initialized');

  const completedAt = new Date().toISOString();
  const name = String(operatorName).trim();
  const sc = Number(score) || 0;
  const et = Number(elapsedTime) || 0;

  db.run(
    'INSERT INTO leaderboard (operatorName, score, elapsedTime, completedAt) VALUES (?, ?, ?, ?)',
    [name, sc, et, completedAt]
  );

  _save();

  const result = db.exec('SELECT last_insert_rowid() as id');
  const newId = result[0].values[0][0];

  const rankResult = db.exec(
    `SELECT COUNT(*) + 1 as rank FROM leaderboard
     WHERE score > ? OR (score = ? AND elapsedTime < ?)`,
    [sc, sc, et]
  );
  const rank = rankResult[0].values[0][0];

  return { id: newId, rank };
}

function getLeaderboard(limit = 50) {
  if (!db) return [];

  const result = db.exec(
    `SELECT id, operatorName, score, elapsedTime, completedAt
     FROM leaderboard
     ORDER BY score DESC, elapsedTime ASC
     LIMIT ?`,
    [limit]
  );

  if (!result || result.length === 0) return [];

  const { columns, values } = result[0];
  return values.map((row, index) => {
    const entry = {};
    columns.forEach((col, i) => { entry[col] = row[i]; });
    entry.rank = index + 1;
    return entry;
  });
}

function _reset() {
  if (db) {
    db.run('DELETE FROM leaderboard');
    _save();
  }
}

module.exports = { initLeaderboard, addEntry, getLeaderboard, _reset };
