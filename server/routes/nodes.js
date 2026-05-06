const express = require('express');
const router = express.Router();
const { NODE_CONFIG } = require('../data/nodeConfig');
const { validateAnswer } = require('../validators/answerValidator');

function getPublicNodeData(node) {
  const { correctAnswer, labelsAnswer, ...publicData } = node;
  return publicData;
}

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const node = NODE_CONFIG.find((n) => n.id === id);

  if (!node) return res.status(404).json({ error: 'Узел не найден.' });

  res.json(getPublicNodeData(node));
});

router.post('/:id/answer', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const node = NODE_CONFIG.find((n) => n.id === id);

  if (!node) return res.status(404).json({ error: 'Узел не найден.' });

  const { answer, attemptNumber } = req.body;

  if (answer === undefined || answer === null) {
    return res.status(400).json({ error: 'Поле answer обязательно.' });
  }

  const attempt = parseInt(attemptNumber, 10);
  if (!attempt || attempt < 1 || attempt > node.maxAttempts) {
    return res.status(400).json({ error: `Номер попытки должен быть от 1 до ${node.maxAttempts}.` });
  }

  const result = validateAnswer(node, answer, attempt);
  res.json(result);
});

module.exports = router;
