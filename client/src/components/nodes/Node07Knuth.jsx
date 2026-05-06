import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const PSEUDOCODE = [
  { line: 'для i от 1 до N:',           indent: 0 },
  { line: '    для j от 1 до N:',        indent: 1 },
  { line: '        если A[i] > A[j]:',   indent: 2 },
  { line: '            swap(A[i], A[j])', indent: 3 },
];

const OPTIONS = [
  { label: 'O(1)',      desc: 'Константное время' },
  { label: 'O(log N)',  desc: 'Логарифмическое' },
  { label: 'O(N)',      desc: 'Линейное' },
  { label: 'O(N log N)',desc: 'Линейно-логарифмическое' },
  { label: 'O(N^2)',    desc: 'Квадратичное' },
  { label: 'O(2^N)',    desc: 'Экспоненциальное' },
];

export default function Node07Knuth({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [selected, setSelected] = useState('');
  const [showExplain, setShowExplain] = useState(false);

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Определи временну́ю сложность алгоритма (Big-O нотация):
      </p>

      {/* Псевдокод */}
      <div style={{
        background: 'rgba(0,255,0,0.03)',
        border: '1px solid var(--fg-dim)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontFamily: 'Press Start 2P',
        fontSize: '0.9rem',
        lineHeight: 1.8,
      }}>
        {PSEUDOCODE.map(({ line, indent }, i) => (
          <div key={i} style={{
            paddingLeft: `${indent * 1.2}rem`,
            color: indent === 0 ? 'var(--fg-bright)' :
                   indent === 1 ? 'var(--fg)' : 'var(--fg-dim)',
          }}>
            {line}
          </div>
        ))}
      </div>

      <button
        className="terminal-btn"
        onClick={() => setShowExplain(!showExplain)}
        style={{ marginBottom: '0.5rem' }}
      >
        {showExplain ? '[СКРЫТЬ ПОДСКАЗКУ]' : '[КАК СЧИТАТЬ СЛОЖНОСТЬ?]'}
      </button>

      {showExplain && (
        <div style={{
          padding: '0.75rem', border: '1px solid var(--fg-dim)',
          fontSize: '0.8rem', color: 'var(--fg-dim)', lineHeight: 1.7,
        }}>
          <p>Считай количество вложенных циклов:</p>
          <p>• 1 цикл до N → O(N)</p>
          <p>• 2 вложенных цикла до N → O(N × N) = O(N²)</p>
          <p>• 3 вложенных цикла до N → O(N³)</p>
        </div>
      )}
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Выбери сложность алгоритма:
      </p>

      {OPTIONS.map(({ label, desc }) => (
        <button
          key={label}
          className="terminal-btn"
          onClick={() => setSelected(label)}
          disabled={locked}
          style={{
            textAlign: 'left',
            background: selected === label ? 'var(--fg)' : 'transparent',
            color: selected === label ? 'var(--bg)' : 'var(--fg)',
            padding: '0.4em 0.8em',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>{label}</span>
          <span style={{
            fontSize: '0.75rem',
            marginLeft: '0.5rem',
            opacity: 0.7,
          }}>— {desc}</span>
        </button>
      ))}

      <button
        className="terminal-btn"
        onClick={() => submit(selected)}
        disabled={locked || !selected}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        [ПОДТВЕРДИТЬ]
      </button>
    </div>
  );

  return (
    <NodeLayout
      nodeId={nodeId}
      title="УЗЕЛ 7"
      person="Дональд Кнут"
      bio="Автор «Искусства программирования». Разработал нотацию Big-O для анализа алгоритмов."
      portrait="/portraits/donald-knuth.jpg"
      hint="Считай количество вложенных циклов — каждый цикл до N умножает сложность на N"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
