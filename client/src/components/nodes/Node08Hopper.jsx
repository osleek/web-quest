import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const BUGGY_CODE = [
  { line: 'arr = [3, 7, 2, 8, 5]', id: 0, hasBug: false },
  { line: 'N = 5',                  id: 1, hasBug: false },
  { line: 'sum = 0',                id: 2, hasBug: false },
  { line: 'i = 0   ← ОШИБКА',      id: 3, hasBug: true  },
  { line: 'пока i < N:',            id: 4, hasBug: false },
  { line: '    sum = sum + arr[i]', id: 5, hasBug: false },
  { line: '    i = i + 1',          id: 6, hasBug: false },
  { line: 'вывод sum',              id: 7, hasBug: false },
];

export default function Node08Hopper({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [showBug, setShowBug] = useState(false);

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '0.75rem' }}>
        Найди ошибку в коде и вычисли правильный результат:
      </p>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Код должен суммировать элементы массива начиная с индекса 1.
      </p>

      <div style={{
        background: 'rgba(0,255,0,0.02)',
        border: '1px solid var(--fg-dim)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontFamily: 'Press Start 2P',
        fontSize: '0.85rem',
      }}>
        {BUGGY_CODE.map(({ line, id, hasBug }) => (
          <div key={id} style={{
            padding: '0.15rem 0.5rem',
            background: hasBug ? 'rgba(255,68,68,0.15)' : 'transparent',
            color: hasBug ? '#ff4444' : 'var(--fg)',
            borderLeft: hasBug ? '2px solid #ff4444' : '2px solid transparent',
          }}>
            {line}
          </div>
        ))}
      </div>

      <button
        className="terminal-btn"
        onClick={() => setShowBug(!showBug)}
        style={{ marginBottom: '0.5rem' }}
      >
        {showBug ? '[СКРЫТЬ АНАЛИЗ]' : '[АНАЛИЗИРОВАТЬ БАГ]'}
      </button>

      {showBug && (
        <div style={{
          padding: '0.75rem', border: '1px solid var(--fg-dim)',
          fontSize: '0.8rem', color: 'var(--fg-dim)',
        }}>
          <p style={{ color: '#ff4444', marginBottom: '0.4rem' }}>ОБНАРУЖЕН БАГ: i = 0</p>
          <p>С багом: arr[0]+arr[1]+...+arr[4] = 3+7+2+8+5 = 25</p>
          <p>Исправление: i = 1</p>
          <p style={{ color: 'var(--fg-bright)', marginTop: '0.4rem' }}>
            Правильно: arr[1]+arr[2]+arr[3]+arr[4] = ?
          </p>
        </div>
      )}
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Введи правильный результат (при i=1):
      </p>
      <input
        className="terminal-input blink-cursor"
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Ответ..."
        disabled={locked}
        onKeyDown={(e) => e.key === 'Enter' && !locked && answer && submit(answer)}
      />
      <button
        className="terminal-btn"
        onClick={() => submit(answer)}
        disabled={locked || !answer}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        [ПОДТВЕРДИТЬ]
      </button>
    </div>
  );

  return (
    <NodeLayout
      nodeId={nodeId}
      title="УЗЕЛ 8"
      person="Грейс Хоппер"
      bio="Разработала первый компилятор. В 1947 году нашла настоящую моль в компьютере Harvard Mark II — первый реальный «баг»."
      hint="Грейс Хоппер нашла настоящую моль в Harvard Mark II в 1947 году"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
