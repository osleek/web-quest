import { useState } from 'react';
import { validateOperatorName } from '../validators/operatorName';
import { startSession } from '../utils/api';

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const { valid, error: validationError } = validateOperatorName(name);
    if (!valid) { setError(validationError); return; }

    setLoading(true);
    setError(null);
    const { data, error: apiError } = await startSession(name);
    setLoading(false);

    if (apiError) { setError(apiError); return; }
    onLogin(data.operatorName, data.sessionId);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <pre style={{ color: 'var(--fg-bright)', textShadow: '0 0 10px var(--fg)', marginBottom: '2rem', fontSize: 'clamp(0.5rem, 1.5vw, 0.85rem)', lineHeight: 1.2, textAlign: 'center' }}>{`
 ██╗████████╗    ███╗   ███╗██╗   ██╗███████╗███████╗██╗   ██╗███╗   ███╗
 ██║╚══██╔══╝    ████╗ ████║██║   ██║██╔════╝██╔════╝██║   ██║████╗ ████║
 ██║   ██║       ██╔████╔██║██║   ██║███████╗█████╗  ██║   ██║██╔████╔██║
 ██║   ██║       ██║╚██╔╝██║██║   ██║╚════██║██╔══╝  ██║   ██║██║╚██╔╝██║
 ██║   ██║       ██║ ╚═╝ ██║╚██████╔╝███████║███████╗╚██████╔╝██║ ╚═╝ ██║
 ╚═╝   ╚═╝       ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝
      `}</pre>

      <div className="terminal-panel" style={{ width: '100%', maxWidth: '480px' }}>
        <p style={{ marginBottom: '0.5rem', color: 'var(--fg-dim)' }}>{'>'} ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...</p>
        <p style={{ marginBottom: '1.5rem', color: 'var(--fg-dim)' }}>{'>'} ТРЕБУЕТСЯ ИДЕНТИФИКАЦИЯ ОПЕРАТОРА</p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>ВВЕДИТЕ НИКНЕЙМ:</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--fg-bright)', lineHeight: '2.2' }}>{'>'}</span>
            <input
              className={`terminal-input blink-cursor${error ? ' terminal-error' : ''}`}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder="operator_name"
              maxLength={32}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
            />
          </div>
          {error && <p className="terminal-error" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>[ОШИБКА] {error}</p>}
          <button className="terminal-btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'ПОДКЛЮЧЕНИЕ...' : '[ВОЙТИ В СИСТЕМУ]'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', color: 'var(--fg-dim)', fontSize: '0.75rem' }}>
          Допустимы: буквы (рус/лат), цифры, подчёркивание. От 2 до 32 символов.
        </p>
      </div>
    </div>
  );
}
