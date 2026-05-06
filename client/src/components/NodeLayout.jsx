import { useState } from 'react';

export default function NodeLayout({ nodeId, title, person, bio, portrait, hint, attempts, maxAttempts = 3, feedback, leftContent, centerContent, rightContent }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.25rem', gap: '1rem' }}>
      <div style={{ borderBottom: '1px solid var(--fg-dim)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--fg-bright)', fontSize: '1.1rem', letterSpacing: '0.08em' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.95rem' }}>
          <span style={{ color: 'var(--fg-dim)' }}>
            ПОПЫТКИ: <span style={{ color: attempts >= maxAttempts ? '#ff5555' : 'var(--fg)', fontWeight: 'bold' }}>{attempts}/{maxAttempts}</span>
          </span>
          {hint && (
            <button className="terminal-btn" onClick={() => setShowHint(!showHint)} style={{ fontSize: '0.85rem', padding: '0.3em 0.8em' }}>
              {showHint ? '[СКРЫТЬ ПОДСКАЗКУ]' : '[ПОДСКАЗКА]'}
            </button>
          )}
        </div>
      </div>

      {showHint && hint && (
        <div className="terminal-hint" style={{ padding: '0.75rem 1rem', border: '1px solid var(--fg-dim)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          {'>'} ПОДСКАЗКА: {hint}
        </div>
      )}

      {feedback && (
        <div className={feedback.type === 'success' ? 'terminal-success' : 'terminal-error'} style={{ padding: '0.75rem 1rem', border: `1px solid ${feedback.type === 'success' ? 'var(--fg-bright)' : '#ff5555'}`, fontSize: '1rem', lineHeight: 1.6 }}>
          {'>'} {feedback.message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div className="terminal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {leftContent || (
            <>
              {portrait ? (
                <img
                  src={portrait}
                  alt={person}
                  className="portrait-filter"
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', display: 'block', border: '1px solid var(--fg-dim)' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '3/4', border: '1px solid var(--fg-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
                  [ПОРТРЕТ]
                </div>
              )}
              <p style={{ color: 'var(--fg-bright)', fontWeight: 'bold', fontSize: '1rem' }}>{person}</p>
              <p style={{ color: 'var(--fg-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>{bio}</p>
            </>
          )}
        </div>
        <div className="terminal-panel" style={{ overflow: 'auto', fontSize: '0.95rem' }}>{centerContent}</div>
        <div className="terminal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>{rightContent}</div>
      </div>
    </div>
  );
}
