const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const OPERATOR_NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9_]{2,32}$/;

router.post('/start', (req, res) => {
  const { operatorName } = req.body;

  if (!operatorName || typeof operatorName !== 'string') {
    return res.status(400).json({ error: 'Имя оператора обязательно.' });
  }

  if (!OPERATOR_NAME_REGEX.test(operatorName)) {
    return res.status(400).json({
      error: 'Имя оператора должно содержать от 2 до 32 символов: буквы, цифры и подчёркивание.',
    });
  }

  const sessionId = uuidv4();
  res.json({ sessionId, operatorName: operatorName.trim() });
});

module.exports = router;
