import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const TERMINAL_LINES = [
  { prompt: true,  text: 'ls -la | grep "^d"' },
  { prompt: false, text: 'drwxr-xr-x  2 root root 4096 Jan 15 10:23 bin' },
  { prompt: false, text: 'drwxr-xr-x  3 root root 4096 Jan 15 10:23 etc' },
  { prompt: false, text: 'drwxr-xr-x  5 root root 4096 Jan 15 10:23 usr' },
  { prompt: true,  text: '_' },
];

export default function Node10Torvalds({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [showExplain, setShowExplain] = useState(false);

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Сколько директорий выводит команда?
      </p>

      <div style={{
        background: '#000',
        border: '1px solid var(--fg-dim)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontFamily: 'Press Start 2P',
        fontSize: '0.85rem',
      }}>
        <div style={{ color: 'var(--fg-dim)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
          user@linux:~$
        </div>
        {TERMINAL_LINES.map((line, i) => (
          <div key={i} style={{
            color: line.prompt ? 'var(--fg-bright)' : 'var(--fg)',
            lineHeight: 1.7,
          }}>
            {line.prompt ? (
              <span>
                <span style={{ color: 'var(--fg-dim)' }}>$ </span>
                <span>{line.text === '_'
                  ? <span className="blink-cursor" style={{ color: 'var(--fg-bright)' }}> </span>
                  : line.text
                }</span>
              </span>
            ) : (
              <span style={{ color: line.text.startsWith('d') ? 'var(--fg-bright)' : 'var(--fg-dim)' }}>
                {line.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        className="terminal-btn"
        onClick={() => setShowExplain(!showExplain)}
        style={{ marginBottom: '0.5rem' }}
      >
        {showExplain ? '[СКРЫТЬ ОБЪЯСНЕНИЕ]' : '[ЧТО ДЕЛАЕТ grep "^d"?]'}
      </button>

      {showExplain && (
        <div style={{
          padding: '0.75rem', border: '1px solid var(--fg-dim)',
          fontSize: '0.8rem', color: 'var(--fg-dim)',
        }}>
          <p><span style={{ color: 'var(--fg-bright)' }}>ls -la</span> — список всех файлов с деталями</p>
          <p><span style={{ color: 'var(--fg-bright)' }}>|</span> — передаёт вывод следующей команде</p>
          <p><span style={{ color: 'var(--fg-bright)' }}>grep "^d"</span> — фильтрует строки, начинающиеся с "d"</p>
          <p style={{ marginTop: '0.4rem' }}>В выводе ls -la строки директорий начинаются с <span style={{ color: 'var(--fg-bright)' }}>d</span>rwxr-xr-x</p>
        </div>
      )}
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Сколько директорий в выводе?
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['1', '2', '3', '4', '5'].map((val) => (
          <button
            key={val}
            className="terminal-btn"
            onClick={() => setAnswer(val)}
            disabled={locked}
            style={{
              flex: '1 0 2rem',
              background: answer === val ? 'var(--fg)' : 'transparent',
              color: answer === val ? 'var(--bg)' : 'var(--fg)',
              fontSize: '1.1rem',
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
      title="УЗЕЛ 10"
      person="Линус Торвальдс"
      bio="Создатель ядра Linux и системы контроля версий Git. Символ открытого программного обеспечения."
      portrait="/portraits/linus-torvalds.jpg"
      hint='grep "^d" выбирает строки, начинающиеся с "d" — это директории в выводе ls -la'
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
