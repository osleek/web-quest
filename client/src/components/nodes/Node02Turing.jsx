import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const CIPHER_TEXT = 'KTPQR';
const KEY = 'CODE';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DECODE_STEPS = [
  { cipher: 'K', key: 'C', cipherNum: 11, keyNum: 3 },
  { cipher: 'T', key: 'O', cipherNum: 20, keyNum: 15 },
  { cipher: 'P', key: 'D', cipherNum: 16, keyNum: 4 },
  { cipher: 'Q', key: 'E', cipherNum: 17, keyNum: 5 },
  { cipher: 'R', key: 'C', cipherNum: 18, keyNum: 3 },
];

export default function Node02Turing({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [showTable, setShowTable] = useState(false);

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Расшифруй текст шифром Виженера.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>КЛЮЧ:</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {KEY.split('').map((ch, i) => (
            <div key={i} style={{
              width: '2.5rem', height: '2.5rem',
              border: '1px solid var(--fg-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-dim)', fontSize: '1.1rem', fontWeight: 'bold',
            }}>{ch}</div>
          ))}
        </div>

        <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>ШИФРОТЕКСТ:</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {CIPHER_TEXT.split('').map((ch, i) => (
            <div key={i} style={{
              width: '2.5rem', height: '2.5rem',
              border: '1px solid var(--fg-bright)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-bright)', fontSize: '1.1rem', fontWeight: 'bold',
              boxShadow: '0 0 6px var(--fg)',
            }}>{ch}</div>
          ))}
        </div>
      </div>

      <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        Алфавит: A=1, B=2, ... Z=26. Для расшифровки вычитай букву ключа.
      </p>

      <button
        className="terminal-btn"
        onClick={() => setShowTable(!showTable)}
        style={{ marginBottom: '0.75rem' }}
      >
        {showTable ? '[СКРЫТЬ ТАБЛИЦУ]' : '[ПОКАЗАТЬ ТАБЛИЦУ ДЕШИФРОВКИ]'}
      </button>

      {showTable && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--fg-dim)' }}>
              <th style={{ padding: '0.3rem', textAlign: 'center' }}>ПОЗ.</th>
              <th style={{ padding: '0.3rem', textAlign: 'center' }}>ШИФР</th>
              <th style={{ padding: '0.3rem', textAlign: 'center' }}>КЛЮЧ</th>
              <th style={{ padding: '0.3rem', textAlign: 'center' }}>ШИФР №</th>
              <th style={{ padding: '0.3rem', textAlign: 'center' }}>КЛЮЧ №</th>
              <th style={{ padding: '0.3rem', textAlign: 'center' }}>РАЗНОСТЬ</th>
            </tr>
          </thead>
          <tbody>
            {DECODE_STEPS.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(0,255,0,0.1)' }}>
                <td style={{ padding: '0.3rem', textAlign: 'center', color: 'var(--fg-dim)' }}>{i + 1}</td>
                <td style={{ padding: '0.3rem', textAlign: 'center', color: 'var(--fg-bright)' }}>{s.cipher}</td>
                <td style={{ padding: '0.3rem', textAlign: 'center', color: 'var(--fg-dim)' }}>{s.key}</td>
                <td style={{ padding: '0.3rem', textAlign: 'center', color: 'var(--fg-dim)' }}>{s.cipherNum}</td>
                <td style={{ padding: '0.3rem', textAlign: 'center', color: 'var(--fg-dim)' }}>{s.keyNum}</td>
                <td style={{ padding: '0.3rem', textAlign: 'center', color: 'var(--fg-bright)' }}>{s.cipherNum - s.keyNum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>АЛФАВИТ:</p>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {[0, 1, 2].map(row => (
              <tr key={row}>
                {ALPHABET.slice(row * 9, row * 9 + 9).map((letter, idx) => {
                  const num = row * 9 + idx + 1;
                  return (
                    <td key={letter} style={{
                      padding: 0,
                      border: '1px solid var(--fg-dim)',
                      width: '2.5rem',
                      height: '2.5rem',
                    }}>
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--fg-dim)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                      }}>
                        {letter}
                        <span style={{
                          position: 'absolute',
                          right: '2px',
                          bottom: '1px',
                          fontSize: '0.55rem',
                          color: 'var(--fg-dim)',
                          lineHeight: 1,
                        }}>
                          {num}
                        </span>
                      </div>
                    </td>
                  );
                })}
                {row === 2 && ALPHABET.slice(18).length < 9 &&
                  Array(9 - ALPHABET.slice(18).length).fill(null).map((_, i) => (
                    <td key={`empty-${i}`} style={{
                      border: '1px solid var(--fg-dim)',
                      width: '2.5rem',
                      height: '2.5rem',
                    }}></td>
                  ))
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Введи расшифрованное слово:
      </p>
      <input
        className="terminal-input blink-cursor"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
        placeholder="ОТВЕТ..."
        maxLength={10}
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
      title="УЗЕЛ 2"
      person="Алан Тьюринг"
      bio="Один из основателей информатики и криптоанализа. Взломал шифр Энигмы."
      portrait="/portraits/alan-turing.jpg"
      hint="Алфавит: A=1, B=2...Z=26. Вычитай номер буквы ключа из номера буквы шифра. Если результат ≤ 0, прибавь 26."
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}