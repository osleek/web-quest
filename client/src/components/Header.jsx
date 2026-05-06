import { formatTime } from '../utils/formatTime';

export default function Header({ currentNodeId, totalNodes = 10, score, elapsed }) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 1.5rem',
      borderBottom: '1px solid var(--fg-dim)',
      background: 'rgba(0,255,0,0.03)',
      fontFamily: 'inherit',
      fontSize: '0.9rem',
      letterSpacing: '0.05em',
    }}>
      <div className="terminal-text-glow" style={{ color: 'var(--fg-bright)' }}>
        [IT MUSEUM QUEST]
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <span>УЗЕЛ: <span style={{ color: 'var(--fg-bright)' }}>{currentNodeId || 0}/{totalNodes}</span></span>
        <span>СЧЁТ: <span style={{ color: 'var(--fg-bright)' }}>{score || 0}</span></span>
        <span>ВРЕМЯ: <span style={{ color: 'var(--fg-bright)', fontVariantNumeric: 'tabular-nums' }}>{formatTime(elapsed || 0)}</span></span>
      </div>
    </header>
  );
}
