import { useState } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';
import { base64Decode } from '../../utils/base64';

const FULL_URL = 'http://museum.org/access?user=guest&token=QUNDRVNT&mode=secure';
const TOKEN = 'QUNDRVNT';

export default function Node05Berners({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [answer, setAnswer] = useState('');
  const [decoderInput, setDecoderInput] = useState('');
  const [decoderOutput, setDecoderOutput] = useState(''); // длина, не сам ответ

  function handleDecode() {
    const result = base64Decode(decoderInput.trim());
    setDecoderOutput(result ? result : '');
  }

  const urlParts = FULL_URL.split('token=QUNDRVNT');

  const centerContent = (
    <div>
      <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>
        Найди параметр <code style={{ color: '#ffff00' }}>token</code> и декодируй его из Base64:
      </p>

      <div style={{
        padding: '0.75rem 1rem',
        border: '1px solid var(--fg-dim)',
        marginBottom: '1rem',
        fontSize: '0.85rem',
        wordBreak: 'break-all',
        lineHeight: 1.8,
      }}>
        <span style={{ color: 'var(--fg-dim)' }}>{urlParts[0]}token=</span>
        <span style={{
          color: '#ffff00',
          background: 'rgba(255,255,0,0.1)',
          padding: '0.1em 0.3em',
          border: '1px solid rgba(255,255,0,0.4)',
        }}>{TOKEN}</span>
        <span style={{ color: 'var(--fg-dim)' }}>{urlParts[1]}</span>
      </div>

      <div style={{
        padding: '0.75rem',
        border: '1px solid var(--fg-dim)',
        marginBottom: '0.5rem',
      }}>
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          BASE64 ДЕКОДЕР (введи строку для декодирования):
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            className="terminal-input"
            type="text"
            value={decoderInput}
            onChange={(e) => { setDecoderInput(e.target.value); setDecoderOutput(''); }}
            placeholder="Вставь Base64 строку..."
            style={{ flex: 1 }}
          />
          <button className="terminal-btn" onClick={handleDecode}>
            [DECODE]
          </button>
        </div>
        {decoderOutput && (
          <div style={{
            padding: '0.4rem 0.6rem',
            border: '1px solid var(--fg-dim)',
            color: 'var(--fg-dim)',
            fontSize: '0.85rem',
          }}>
            {'>'} Декодировано: {decoderOutput.length} символов. Введи результат в поле ответа →
          </div>
        )}
      </div>
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
        {'>'} Введи декодированное значение токена:
      </p>
      <input
        className="terminal-input blink-cursor"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
        placeholder="ОТВЕТ..."
        maxLength={20}
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
      title="УЗЕЛ 5"
      person="Тим Бернерс-Ли"
      bio="Создатель World Wide Web. Разработал HTTP, HTML и первый браузер."
      hint="QUNDRVNT → декодируй из Base64"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
