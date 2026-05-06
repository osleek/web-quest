import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const OPERATIONS = [
  { op: 'PUSH', val: 5,   desc: 'Добавить 5 в стек' },
  { op: 'PUSH', val: 3,   desc: 'Добавить 3 в стек' },
  { op: 'PUSH', val: 8,   desc: 'Добавить 8 в стек' },
  { op: 'POP',  val: null, desc: 'Удалить верхний элемент' },
  { op: 'PUSH', val: 1,   desc: 'Добавить 1 в стек' },
  { op: 'POP',  val: null, desc: 'Удалить верхний элемент' },
];

export default function Node09Neumann({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [step, setStep] = useState(-1); 
  const [stackHistory, setStackHistory] = useState([[]]);

  function handleNextStep() {
    if (step >= OPERATIONS.length - 1) return;
    const nextStep = step + 1;
    setStep(nextStep);

    const prevStack = stackHistory[stackHistory.length - 1];
    const op = OPERATIONS[nextStep];
    let newStack;
    if (op.op === 'PUSH') {
      newStack = [...prevStack, op.val];
    } else {
      newStack = prevStack.slice(0, -1);
    }
    setStackHistory([...stackHistory, newStack]);
  }

  function handleReset() {
    setStep(-1);
    setStackHistory([[]]);
  }

  const currentStack = stackHistory[stackHistory.length - 1];
  const isFinished = step === OPERATIONS.length - 1;

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Выполни операции со стеком и определи его верхний элемент:
      </p>

      <div style={{
        border: '1px solid var(--fg-dim)',
        padding: '0.75rem',
        marginBottom: '1rem',
        fontFamily: 'Press Start 2P',
        fontSize: '0.85rem',
      }}>
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          ОПЕРАЦИИ:
        </p>
        {OPERATIONS.map((op, i) => (
          <div key={i} style={{
            padding: '0.2rem 0.5rem',
            marginBottom: '0.2rem',
            background: i === step ? 'rgba(0,255,0,0.15)' : 'transparent',
            borderLeft: i === step ? '2px solid var(--fg-bright)' : '2px solid transparent',
            color: i < step ? 'var(--fg-dim)' :
                   i === step ? 'var(--fg-bright)' : 'var(--fg)',
          }}>
            <span style={{
              color: op.op === 'PUSH' ? '#00aaff' : '#ff9900',
              fontWeight: 'bold',
              marginRight: '0.5rem',
            }}>
              {op.op}
            </span>
            {op.val !== null && (
              <span style={{ marginRight: '0.5rem' }}>{op.val}</span>
            )}
            <span style={{ color: 'var(--fg-dim)', fontSize: '0.75rem' }}>
              — {op.desc}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
          СТЕК (снизу → вверх):
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '0.3rem',
          minHeight: '4rem',
          padding: '0.5rem',
          border: '1px solid var(--fg-dim)',
          background: 'rgba(0,255,0,0.02)',
        }}>
          {currentStack.length === 0 ? (
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', textAlign: 'center', alignSelf: 'center' }}>
              [пусто]
            </div>
          ) : (
            currentStack.map((val, i) => (
              <div key={i} style={{
                padding: '0.3rem 0.75rem',
                border: `1px solid ${i === currentStack.length - 1 ? 'var(--fg-bright)' : 'var(--fg-dim)'}`,
                color: i === currentStack.length - 1 ? 'var(--fg-bright)' : 'var(--fg)',
                background: i === currentStack.length - 1 ? 'rgba(0,255,0,0.1)' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
              }}>
                <span>{val}</span>
                {i === currentStack.length - 1 && (
                  <span style={{ color: 'var(--fg-dim)', fontSize: '0.7rem' }}>← TOP</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="terminal-btn"
          onClick={handleNextStep}
          disabled={isFinished || locked}
          style={{ flex: 1 }}
        >
          {isFinished ? '[ГОТОВО]' : '[СЛЕДУЮЩИЙ ШАГ]'}
        </button>
        <button
          className="terminal-btn"
          onClick={handleReset}
          disabled={step === -1 || locked}
          style={{ flex: 1 }}
        >
          [СБРОС]
        </button>
      </div>
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Что находится на вершине стека после всех операций?
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
      title="УЗЕЛ 9"
      person="Джон фон Нейман"
      bio="Разработал архитектуру современного компьютера. Стек — ключевая структура данных в работе процессора."
      hint="PUSH добавляет элемент на вершину, POP удаляет с вершины. Принцип LIFO: последний вошёл — первый вышел."
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
