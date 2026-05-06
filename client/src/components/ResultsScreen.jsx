import { useEffect, useState, useRef } from 'react';
import { formatTime } from '../utils/formatTime';
import { submitResult } from '../utils/api';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function ResultsScreen({ questState, elapsedTime, onReset }) {
  const { leaderboard: remoteLeaderboard, loadLeaderboard } = useLeaderboard();
  const [localLeaderboard, setLocalLeaderboard] = useState(null);
  const [myRank, setMyRank] = useState(null);
  const submitRef = useRef(false);

  const leaderboard = localLeaderboard || remoteLeaderboard;

  useEffect(() => {
    async function submit() {
      if (submitRef.current) return;
      submitRef.current = true;
      const { data } = await submitResult(questState.operatorName, questState.score, elapsedTime);
      if (data) {
        setMyRank(data.rank);
        if (data.leaderboard) {
          setLocalLeaderboard(data.leaderboard);
        } else {
          await loadLeaderboard();
        }
      }
    }
    submit();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nodeResults = questState.nodeResults || {};

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="terminal-panel" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--fg-bright)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          КВЕСТ ЗАВЕРШЁН, {questState.operatorName}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '1rem' }}>
          <div>
            <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem' }}>ИТОГОВЫЙ СЧЁТ</p>
            <p style={{ color: 'var(--fg-bright)', fontSize: '2rem' }}>{questState.score}</p>
          </div>
          <div>
            <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem' }}>ВРЕМЯ</p>
            <p style={{ color: 'var(--fg-bright)', fontSize: '2rem' }}>{formatTime(elapsedTime)}</p>
          </div>
          {myRank && (
            <div>
              <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem' }}>РАНГ</p>
              <p style={{ color: 'var(--fg-bright)', fontSize: '2rem' }}>#{myRank}</p>
            </div>
          )}
        </div>
      </div>

      <div className="terminal-panel" style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--fg-bright)', marginBottom: '0.75rem' }}>РЕЗУЛЬТАТЫ ПО УЗЛАМ:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--fg-dim)' }}>
              <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>УЗЕЛ</th>
              <th style={{ textAlign: 'center', padding: '0.3rem 0.5rem' }}>СТАТУС</th>
              <th style={{ textAlign: 'right', padding: '0.3rem 0.5rem' }}>БАЛЛЫ</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((id) => {
              const result = nodeResults[id];
              return (
                <tr key={id} style={{ borderBottom: '1px solid rgba(0,255,0,0.1)' }}>
                  <td style={{ padding: '0.3rem 0.5rem', color: 'var(--fg-dim)' }}>{String(id).padStart(2, '0')}</td>
                  <td style={{ padding: '0.3rem 0.5rem', textAlign: 'center' }}>
                    {result
                      ? <span style={{ color: result.correct ? 'var(--fg-bright)' : '#ff4444' }}>{result.correct ? '✓ ВЕРНО' : '✗ НЕВЕРНО'}</span>
                      : <span style={{ color: 'var(--fg-dim)' }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '0.3rem 0.5rem', textAlign: 'right', color: 'var(--fg-bright)' }}>{result ? result.pointsAwarded : 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="terminal-panel" style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--fg-bright)', marginBottom: '0.75rem' }}>ТАБЛИЦА РЕЙТИНГА:</p>
        {leaderboard.length === 0 ? (
          <p style={{ color: 'var(--fg-dim)' }}>{'>'} Будьте первым!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--fg-dim)' }}>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>РАНГ</th>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>ОПЕРАТОР</th>
                <th style={{ textAlign: 'right', padding: '0.3rem 0.5rem' }}>СЧЁТ</th>
                <th style={{ textAlign: 'right', padding: '0.3rem 0.5rem' }}>ВРЕМЯ</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 10).map((entry) => {
                const isMe = entry.operatorName === questState.operatorName && entry.rank === myRank;
                return (
                  <tr key={entry.id} style={{ borderBottom: '1px solid rgba(0,255,0,0.1)', background: isMe ? 'rgba(0,255,0,0.08)' : 'transparent' }}>
                    <td style={{ padding: '0.3rem 0.5rem', color: isMe ? 'var(--fg-yellow)' : 'var(--fg-dim)' }}>#{entry.rank}</td>
                    <td style={{ padding: '0.3rem 0.5rem', color: isMe ? 'var(--fg-yellow)' : 'var(--fg)' }}>{isMe ? '► ' : ''}{entry.operatorName}</td>
                    <td style={{ padding: '0.3rem 0.5rem', textAlign: 'right', color: 'var(--fg-bright)' }}>{entry.score}</td>
                    <td style={{ padding: '0.3rem 0.5rem', textAlign: 'right', color: 'var(--fg-dim)' }}>{formatTime(entry.elapsedTime)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button className="terminal-btn" onClick={onReset} style={{ width: '100%' }}>[НАЧАТЬ ЗАНОВО]</button>
    </div>
  );
}
