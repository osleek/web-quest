import { useState, useCallback } from 'react';
import { submitAnswer } from '../utils/api';

export function useNodeAnswer(nodeId, maxAttempts = 3, onComplete) {
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);

  const submit = useCallback(async (answer) => {
    if (locked) return;

    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);

    const { data, error } = await submitAnswer(nodeId, answer, nextAttempt);

    if (error) {
      setFeedback({ type: 'error', message: `Ошибка соединения: ${error}` });
      setAttempts((a) => a - 1);
      return;
    }

    if (data.correct) {
      setFeedback({ type: 'success', message: `ВЕРНО! +${data.pointsAwarded} баллов` });
      setLocked(true);
      setTimeout(() => onComplete(data.pointsAwarded, true), 1200);
    } else if (data.attemptsLeft === 0) {
      const revealMsg = data.correctAnswer
        ? `ПОПЫТКИ ИСЧЕРПАНЫ. Правильный ответ: ${typeof data.correctAnswer === 'object' ? JSON.stringify(data.correctAnswer) : data.correctAnswer}`
        : 'ПОПЫТКИ ИСЧЕРПАНЫ. Баллы не начислены.';
      setFeedback({ type: 'error', message: revealMsg });
      setLocked(true);
      setTimeout(() => onComplete(0, false), 2500);
    } else {
      const slotsMsg = data.wrongSlots?.length ? ` Неверные позиции: ${data.wrongSlots.join(', ')}.` : '';
      setFeedback({ type: 'error', message: `НЕВЕРНО. Осталось попыток: ${data.attemptsLeft}.${slotsMsg}` });
    }
  }, [nodeId, attempts, locked, onComplete]);

  return { attempts, maxAttempts, feedback, locked, submit };
}
