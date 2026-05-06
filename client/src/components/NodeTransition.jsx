import { useState, useEffect } from 'react';

const BOOT_LINES = [
  'СОХРАНЕНИЕ РЕЗУЛЬТАТА...',
  'ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ...',
  'ЗАГРУЗКА СЛЕДУЮЩЕГО УЗЛА...',
  'ИНИЦИАЛИЗАЦИЯ МОДУЛЯ...',
  'ПРОВЕРКА ЦЕЛОСТНОСТИ...',
  'ГОТОВО.',
];

export default function NodeTransition({ nodeId, onComplete }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        setTimeout(onComplete, 600);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="terminal-panel" style={{ maxWidth: '480px', width: '100%' }}>
        <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem' }}>УЗЕЛ {nodeId} ЗАВЕРШЁН</p>
        {lines.map((line, idx) => (
          <p key={idx} style={{ color: idx === lines.length - 1 && done ? 'var(--fg-bright)' : 'var(--fg-dim)', lineHeight: 1.8 }}>
            {'>'} {line}
          </p>
        ))}
        {!done && <span className="blink-cursor" style={{ color: 'var(--fg-bright)' }}> </span>}
      </div>
    </div>
  );
}
