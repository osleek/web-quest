function normalizeAnswer(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().toUpperCase();
}

function validateLabels(labelsAnswer, submittedLabels) {
  if (!submittedLabels || typeof submittedLabels !== 'object') {
    return { correct: false, wrongSlots: Object.keys(labelsAnswer) };
  }
  const wrongSlots = [];
  for (const [slot, correctLabel] of Object.entries(labelsAnswer)) {
    if (normalizeAnswer(submittedLabels[slot]) !== normalizeAnswer(correctLabel)) {
      wrongSlots.push(slot);
    }
  }
  return { correct: wrongSlots.length === 0, wrongSlots };
}

function validateAnswer(nodeConfig, answer, attemptNumber) {
  const { points, maxAttempts, correctAnswer, answerType, labelsAnswer } = nodeConfig;
  const attemptsLeft = maxAttempts - attemptNumber;

  if (answerType === 'labels') {
    const { correct, wrongSlots } = validateLabels(labelsAnswer, answer);
    if (correct) return { correct: true, pointsAwarded: points, attemptsLeft, correctAnswer: null };
    if (attemptsLeft > 0) return { correct: false, pointsAwarded: 0, attemptsLeft, correctAnswer: null, wrongSlots };
    return { correct: false, pointsAwarded: 0, attemptsLeft: 0, correctAnswer: labelsAnswer, wrongSlots };
  }

  if (answerType === 'sql') {
    const correct = normalizeAnswer(answer) === normalizeAnswer(correctAnswer);
    if (correct) return { correct: true, pointsAwarded: points, attemptsLeft, correctAnswer: null };
    if (attemptsLeft > 0) return { correct: false, pointsAwarded: 0, attemptsLeft, correctAnswer: null };
    return { correct: false, pointsAwarded: 0, attemptsLeft: 0, correctAnswer };
  }

  const correct = normalizeAnswer(answer) === normalizeAnswer(correctAnswer);
  if (correct) return { correct: true, pointsAwarded: points, attemptsLeft, correctAnswer: null };
  if (attemptsLeft > 0) return { correct: false, pointsAwarded: 0, attemptsLeft, correctAnswer: null };
  return { correct: false, pointsAwarded: 0, attemptsLeft: 0, correctAnswer };
}

module.exports = { normalizeAnswer, validateAnswer, validateLabels };
