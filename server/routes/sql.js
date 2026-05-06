const express = require('express');
const router = express.Router();
const { execute, getTableData } = require('../data/sqlEngine');

router.post('/execute', (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ rows: null, error: 'Поле query обязательно.' });
  }

  const trimmed = query.trim();
  const firstToken = trimmed.split(/\s+/)[0]?.toUpperCase();

  if (firstToken && firstToken !== 'SELECT') {
    return res.status(400).json({ rows: null, error: 'Разрешены только SELECT-запросы.' });
  }

  return res.status(200).json(execute(query));
});

router.get('/table', (req, res) => {
  res.json({ rows: getTableData() });
});

module.exports = router;
