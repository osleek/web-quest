const express = require('express');
const cors = require('cors');
const path = require('path');
const { init: initSqlEngine } = require('./data/sqlEngine');
const { initLeaderboard } = require('./store/leaderboard');

const sessionRoutes = require('./routes/session');
const nodesRoutes = require('./routes/nodes');
const sqlRoutes = require('./routes/sql');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3002;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.use('/api/session', sessionRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/sql', sqlRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (isProd) {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
});

Promise.all([initSqlEngine(), initLeaderboard()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[IT Museum Quest] Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize:', err);
    process.exit(1);
  });

module.exports = app;
