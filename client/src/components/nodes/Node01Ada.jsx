import { useState, useRef } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const PSEUDOCODE = [
  { line: 'f = 1',       id: 0 },
  { line: 'i = 1',       id: 1 },
  { line: 'пока i <= n:', id: 2 },
  { line: '    f = f * i', id: 3 },
  { line: '    i = i + 1', id: 4 },
  { line: 'вывод f',     id: 5 },
];

const LOOP_STEPS = [
  { highlight: [0, 1], label: 'Инициализация: f=1, i=1' },
  { highlight: [2, 3, 4], label: 'i=1: f = 1×1 = 1, i=2' },
  { highlight: [2, 3, 4], label: 'i=2: f = 1×2 = 2, i=3' },
  { highlight: [2, 3, 4], label: 'i=3: f = 2×3 = 6, i=4' },
  { highlight: [2, 3, 4], label: 'i=4: f = 6×4 = 24, i=5' },
  { highlight: [2, 3, 4], label: 'i=5: f = 24×5 = 120, i=6' },
  { highlight: [2],       label: 'i=6 > 5, цикл завершён' },
  { highlight: [5],       label: 'вывод f → ???' },
];

export default function Node01Ada({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [stepIdx, setStepIdx] = useState(-1);
  const [stepLabel, setStepLabel] = useState('');

  function handleScroll() {
    const next = stepIdx + 1;
    if (next < LOOP_STEPS.length) {
      setStepIdx(next);
      setStepLabel(LOOP_STEPS[next].label);
    } else {
      setStepIdx(-1);
      setStepLabel('Цикл сброшен. Нажми снова.');
    }
  }

  const currentHighlight = stepIdx >= 0 ? LOOP_STEPS[stepIdx].highlight : [];

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        При n = 5 вычисли итоговое значение f:
      </p>

      <div style={{
        background: 'rgba(0,255,0,0.04)',
        border: '1px solid var(--fg-dim)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontFamily: 'Press Start 2P'
      }}>
        {PSEUDOCODE.map(({ line, id }) => (
          <div key={id} style={{
            padding: '0.15rem 0.5rem',
            background: currentHighlight.includes(id) ? 'rgba(0,255,0,0.2)' : 'transparent',
            color: currentHighlight.includes(id) ? 'var(--fg-bright)' : 'var(--fg)',
            transition: 'background 0.3s',
            borderLeft: currentHighlight.includes(id) ? '2px solid var(--fg-bright)' : '2px solid transparent',
          }}>
            {line}
          </div>
        ))}
      </div>

      {stepLabel && (
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          {'>'} {stepLabel}
        </p>
      )}

      <button
        className="terminal-btn"
        onClick={handleScroll}
        disabled={locked}
        style={{ width: '100%' }}
      >
        [ПРОКРУТИТЬ ЦИКЛ]
      </button>
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Введи значение f после выполнения цикла:
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
        style={{ width: '100%' }}
      >
        [ПОДТВЕРДИТЬ]
      </button>
    </div>
  );

  return (
    <NodeLayout
      nodeId={nodeId}
      title="УЗЕЛ 1"
      person="Ада Лавлейс"
      bio="Первая программистка. Показала, что машина может исполнять алгоритмы."
      portrait="/portraits/ada-lovelace.png"
      hint="5! = 1×2×3×4×5"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
