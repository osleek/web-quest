const initSqlJs = require('sql.js');

const MAX_QUERY_LENGTH = 2000;

let db = null;

async function init() {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  db.run(`
    CREATE TABLE museum_staff (
      id      INTEGER PRIMARY KEY,
      name    TEXT NOT NULL,
      dept    TEXT NOT NULL,
      salary  INTEGER NOT NULL
    );
  `);

  db.run(`
    INSERT INTO museum_staff VALUES
      (1, 'Alice', 'IT', 99000),
      (2, 'Bob', 'HR', 60000),
      (3, 'Carol', 'IT', 85000),
      (4, 'David', 'Design', 70000),
      (5, 'Eve', 'IT', 95000);
  `);

  return db;
}

function execute(query) {
  if (!db) return { rows: null, error: 'База данных не инициализирована.' };
  if (!query || typeof query !== 'string') return { rows: null, error: 'Запрос не может быть пустым.' };

  const trimmed = query.trim();

  if (trimmed.length > MAX_QUERY_LENGTH) {
    return { rows: null, error: `Запрос слишком длинный (максимум ${MAX_QUERY_LENGTH} символов).` };
  }

  const firstToken = trimmed.split(/\s+/)[0].toUpperCase();
  if (firstToken !== 'SELECT') {
    return { rows: null, error: 'Разрешены только SELECT-запросы.' };
  }

  try {
    const results = db.exec(trimmed);
    if (!results || results.length === 0) return { rows: [], error: null };

    const { columns, values } = results[0];
    const rows = values.map((row) => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });

    return { rows, error: null };
  } catch (err) {
    return { rows: null, error: `Ошибка SQL: ${err.message}` };
  }
}

function getTableData() {
  if (!db) return [];
  const result = execute('SELECT * FROM museum_staff ORDER BY id');
  return result.rows || [];
}

module.exports = { init, execute, getTableData };
