import { useState } from 'react';

export default function NodeLayout({ nodeId, title, person, bio, hint, attempts, maxAttempts = 3, feedback, leftContent, centerContent, rightContent }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem', gap: '1rem' }}>
      <div style={{ borderBottom: '1px solid var(--fg-dim)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--fg-bright)', fontSize: '1rem', letterSpacing: '0.1em' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--fg-dim)' }}>
            ПОПЫТКИ: <span style={{ color: attempts >= maxAttempts ? '#ff4444' : 'var(--fg)' }}>{attempts}/{maxAttempts}</span>
          </span>
          {hint && (
            <button className="terminal-btn" onClick={() => setShowHint(!showHint)} style={{ fontSize: '0.75rem', padding: '0.2em 0.6em' }}>
              {showHint ? '[СКРЫТЬ ПОДСКАЗКУ]' : '[ПОДСКАЗКА]'}
            </button>
          )}
        </div>
      </div>

      {showHint && hint && (
        <div className="terminal-hint" style={{ padding: '0.5rem 1rem', border: '1px solid var(--fg-dim)', fontSize: '0.85rem' }}>
          {'>'} ПОДСКАЗКА: {hint}
        </div>
      )}

      {feedback && (
        <div className={feedback.type === 'success' ? 'terminal-success' : 'terminal-error'} style={{ padding: '0.5rem 1rem', border: `1px solid ${feedback.type === 'success' ? 'var(--fg-bright)' : '#ff4444'}`, fontSize: '0.9rem' }}>
          {'>'} {feedback.message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '1rem', flex: 1, minHeight: 0 }}>
        <div className="terminal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {leftContent || (
            <>
              <div style={{ width: '100%', aspectRatio: '3/4', border: '1px solid var(--fg-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-dim)', fontSize: '0.75rem' }}>
                [ПОРТРЕТ]
              </div>
              <p style={{ color: 'var(--fg-bright)', fontWeight: 'bold', fontSize: '0.9rem' }}>{person}</p>
              <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', lineHeight: 1.6 }}>{bio}</p>
            </>
          )}
        </div>
        <div className="terminal-panel" style={{ overflow: 'auto' }}>{centerContent}</div>
        <div className="terminal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{rightContent}</div>
      </div>
    </div>
  );
}
