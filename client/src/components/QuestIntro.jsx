export default function QuestIntro({ operatorName, onStart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem', textAlign: 'center' }}>
      <div className="terminal-panel" style={{ maxWidth: '640px', width: '100%' }}>
        <p style={{ color: 'var(--fg-bright)', marginBottom: '1rem', fontSize: '1.1rem' }}>
          ДОБРО ПОЖАЛОВАТЬ В IT MUSEUM, <span style={{ textShadow: '0 0 8px var(--fg)' }}>{operatorName}</span>
        </p>
        <div style={{ color: 'var(--fg-dim)', marginBottom: '1.5rem', lineHeight: 1.8, textAlign: 'left' }}>
          <p>{'>'} ЗАГРУЗКА IT MUSEUM...</p>
          <p>{'>'} ОБНАРУЖЕНО 10 УЗЛОВ-ИСПЫТАНИЙ</p>
          <p>{'>'} КАЖДЫЙ УЗЕЛ ПОСВЯЩЁН ВЕЛИКОМУ УЧЁНОМУ</p>
          <p>{'>'} МАКСИМУМ 3 ПОПЫТКИ НА КАЖДОЕ ЗАДАНИЕ</p>
          <p>{'>'} ТАЙМЕР ЗАПУСТИТСЯ ПРИ СТАРТЕ</p>
          <p style={{ color: 'var(--fg-bright)' }}>{'>'} ГОТОВ К ИНИЦИАЛИЗАЦИИ</p>
        </div>
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem', border: '1px solid var(--fg-dim)', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--fg-dim)', marginBottom: '0.5rem' }}>УЗЛЫ КВЕСТА:</p>
          {['01. АДА ЛАВЛЕЙС', '02. АЛАН ТЬЮРИНГ', '03. КЛОД ШЕННОН', '04. СЕРФ И КАН', '05. ТИМ БЕРНЕРС-ЛИ', '06. ЭДГАР КОДД', '07. ДОНАЛЬД КНУТ', '08. ГРЕЙС ХОППЕР', '09. ФОН НЕЙМАН', '10. ЛИНУС ТОРВАЛЬДС'].map((line) => (
            <p key={line} style={{ color: 'var(--fg-dim)', lineHeight: 1.6 }}>{line}</p>
          ))}
        </div>
        <button className="terminal-btn terminal-text-glow" onClick={onStart} style={{ fontSize: '1rem', padding: '0.6em 2em' }}>
          [НАЧАТЬ КВЕСТ]
        </button>
      </div>
    </div>
  );
}
