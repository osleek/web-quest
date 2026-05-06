import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

export default function Node03Shannon({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [showCalc, setShowCalc] = useState(false);

  const A = 1, B = 0;
  const notA = A === 1 ? 0 : 1;
  const aAndB = A & B;
  const result = notA | aAndB;

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Вычисли значение схемы при A=1, B=0:
      </p>

      <div style={{
        border: '1px solid var(--fg-dim)',
        padding: '1rem',
        marginBottom: '1rem',
        fontFamily: 'Press Start 2P',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '1px solid var(--fg-bright)', padding: '0.3rem 0.8rem',
              color: 'var(--fg-bright)',
            }}>A = 1</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '1px solid var(--fg-bright)', padding: '0.3rem 0.8rem',
              color: 'var(--fg-bright)',
            }}>B = 0</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
          {[
            { label: 'NOT A', inputs: 'A', symbol: '¬', color: '#ff9900' },
            { label: 'A AND B', inputs: 'A, B', symbol: '∧', color: '#00aaff' },
            { label: '(NOT A) OR (A AND B)', inputs: 'NOT A, A AND B', symbol: '∨', color: 'var(--fg-bright)' },
          ].map(({ label, inputs, symbol, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.4rem 0.75rem',
              border: `1px solid ${color}`,
              background: 'rgba(0,255,0,0.02)',
            }}>
              <span style={{
                fontSize: '1.2rem', color, minWidth: '1.5rem', textAlign: 'center',
              }}>{symbol}</span>
              <div>
                <span style={{ color }}>{label}</span>
                <span style={{ color: 'var(--fg-dim)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                  ({inputs})
                </span>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--fg-dim)' }}>→ ?</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="terminal-btn"
        onClick={() => setShowCalc(!showCalc)}
        style={{ marginBottom: '0.5rem' }}
      >
        {showCalc ? '[СКРЫТЬ ВЫЧИСЛЕНИЯ]' : '[ПОКАЗАТЬ ПРОМЕЖУТОЧНЫЕ ЗНАЧЕНИЯ]'}
      </button>

      {showCalc && (
        <div style={{
          padding: '0.75rem', border: '1px solid var(--fg-dim)',
          fontSize: '0.85rem', color: 'var(--fg-dim)',
        }}>
          <p>NOT A = NOT 1 = <span style={{ color: 'var(--fg-bright)' }}>{notA}</span></p>
          <p>A AND B = 1 AND 0 = <span style={{ color: 'var(--fg-bright)' }}>{aAndB}</span></p>
          <p>(NOT A) OR (A AND B) = {notA} OR {aAndB} = <span style={{ color: 'var(--fg-bright)' }}>?</span></p>
        </div>
      )}
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Итоговое значение (NOT A) OR (A AND B):
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['0', '1'].map((val) => (
          <button
            key={val}
            className="terminal-btn"
            onClick={() => setAnswer(val)}
            disabled={locked}
            style={{
              flex: 1,
              background: answer === val ? 'var(--fg)' : 'transparent',
              color: answer === val ? 'var(--bg)' : 'var(--fg)',
              fontSize: '1.2rem',
            }}
          >
            {val}
          </button>
        ))}
      </div>
      {answer && (
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem' }}>
          Выбрано: <span style={{ color: 'var(--fg-bright)' }}>{answer}</span>
        </p>
      )}
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
      title="УЗЕЛ 3"
      person="Клод Шеннон"
      bio="Создатель теории информации. Заложил математические основы цифровых схем."
      hint="NOT 1 = 0; 1 AND 0 = 0; 0 OR 0 = 0"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
