import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';

const IP = [192, 168, 10, 47];
const MASK = [255, 255, 255, 240]; 

function toBinary(n) {
  return n.toString(2).padStart(8, '0');
}

export default function Node04Cerf({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [showMask, setShowMask] = useState(false);
  const [showAnd, setShowAnd] = useState(false);

  const networkAddr = IP.map((octet, i) => octet & MASK[i]);

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Определи адрес сети для IP-адреса:
      </p>

      {/* IP адрес */}
      <div style={{
        padding: '0.75rem 1rem',
        border: '1px solid var(--fg-bright)',
        marginBottom: '1rem',
        fontSize: '1.1rem',
        letterSpacing: '0.1em',
        color: 'var(--fg-bright)',
        textAlign: 'center',
      }}>
        192.168.10.47 / 28
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          className="terminal-btn"
          onClick={() => setShowMask(!showMask)}
          style={{ flex: 1 }}
        >
          {showMask ? '[СКРЫТЬ МАСКУ]' : '[ПОКАЗАТЬ МАСКУ]'}
        </button>
        <button
          className="terminal-btn"
          onClick={() => setShowAnd(!showAnd)}
          style={{ flex: 1 }}
        >
          {showAnd ? '[СКРЫТЬ AND]' : '[ПОСЧИТАТЬ AND]'}
        </button>
      </div>

      {showMask && (
        <div style={{
          padding: '0.5rem 1rem', border: '1px solid var(--fg-dim)',
          marginBottom: '0.75rem', fontSize: '0.85rem',
        }}>
          <p style={{ color: 'var(--fg-dim)' }}>Маска /28:</p>
          <p style={{ color: 'var(--fg-bright)' }}>
            {MASK.join('.')}
          </p>
        </div>
      )}

      {showAnd && (
        <div style={{
          padding: '0.75rem', border: '1px solid var(--fg-dim)',
          fontSize: '0.75rem', fontFamily: 'monospace',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--fg-dim)' }}>
                <th style={{ padding: '0.2rem 0.4rem', textAlign: 'left' }}>ОКТЕТ</th>
                {[1, 2, 3, 4].map(n => (
                  <th key={n} style={{ padding: '0.2rem 0.4rem', textAlign: 'center' }}>{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: 'var(--fg-dim)', padding: '0.2rem 0.4rem' }}>IP</td>
                {IP.map((oct, i) => (
                  <td key={i} style={{ padding: '0.2rem 0.4rem', textAlign: 'center', color: 'var(--fg)' }}>
                    {toBinary(oct)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ color: 'var(--fg-dim)', padding: '0.2rem 0.4rem' }}>МАСКА</td>
                {MASK.map((oct, i) => (
                  <td key={i} style={{ padding: '0.2rem 0.4rem', textAlign: 'center', color: 'var(--fg-dim)' }}>
                    {toBinary(oct)}
                  </td>
                ))}
              </tr>
              <tr style={{ borderTop: '1px solid var(--fg-dim)' }}>
                <td style={{ color: 'var(--fg-bright)', padding: '0.2rem 0.4rem' }}>AND</td>
                {networkAddr.map((oct, i) => (
                  <td key={i} style={{ padding: '0.2rem 0.4rem', textAlign: 'center', color: 'var(--fg-bright)' }}>
                    {toBinary(oct)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ color: 'var(--fg-dim)', padding: '0.2rem 0.4rem' }}>DEC</td>
                {networkAddr.map((oct, i) => (
                  <td key={i} style={{ padding: '0.2rem 0.4rem', textAlign: 'center', color: 'var(--fg-bright)' }}>
                    {oct}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Введи адрес сети (формат: X.X.X.X):
      </p>
      <input
        className="terminal-input blink-cursor"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="192.168.X.X"
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
      title="УЗЕЛ 4"
      person="Винт Серф и Боб Кан"
      bio="Создатели протокола TCP/IP — основы современного интернета."
      hint="Маска /28 = 255.255.255.240; 47 AND 240 = 32"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
