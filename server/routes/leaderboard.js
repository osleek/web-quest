const express = require('express');
const router = express.Router();
const { addEntry, getLeaderboard } = require('../store/leaderboard');

router.get('/', (req, res) => {
  res.json({ leaderboard: getLeaderboard(50) });
});

router.post('/', (req, res) => {
  const { operatorName, score, elapsedTime } = req.body;

  if (!operatorName || typeof operatorName !== 'string') {
    return res.status(400).json({ error: 'operatorName обязателен.' });
  }
  if (typeof score !== 'number' || typeof elapsedTime !== 'number') {
    return res.status(400).json({ error: 'score и elapsedTime должны быть числами.' });
  }

  const { id, rank } = addEntry({ operatorName, score, elapsedTime });
  res.json({ id, rank, leaderboard: getLeaderboard(50) });
});

module.exports = router;
