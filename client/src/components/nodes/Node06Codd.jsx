import { useState, useEffect } from 'react';
import NodeLayout from '../NodeLayout';
import { useNodeAnswer } from '../../hooks/useNodeAnswer';
import { executeSql, getSqlTable, submitAnswer } from '../../utils/api';

const INITIAL_QUERY = '';

export default function Node06Codd({ nodeId, onComplete }) {
  const { attempts, maxAttempts, feedback, locked, submit } = useNodeAnswer(nodeId, 3, onComplete);
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [sqlAttempts, setSqlAttempts] = useState(0); 

  useEffect(() => {
    getSqlTable().then(({ data }) => {
      if (data?.rows) setTableData(data.rows);
    });
  }, []);

  async function handleExecute() {
    setQueryResult(null);
    setQueryError(null);

    const { data, error } = await executeSql(query);
    if (error) {
      setQueryError(`Ошибка соединения: ${error}`);
      return;
    }
    if (data.error) {
      setQueryError(data.error);
      return;
    }

    setQueryResult(data.rows);

    if (data.rows && data.rows.length === 1 && data.rows[0].name) {
      const nextAttempt = sqlAttempts + 1;
      setSqlAttempts(nextAttempt);
      submit(data.rows[0].name);
    } else if (data.rows && data.rows.length > 0) {
      setQueryError('Запрос вернул несколько строк. Нужна ровно одна строка с именем.');
    } else {
      setQueryError('Запрос не вернул результатов.');
    }
  }

  const centerContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-bright)' }}>
        Напиши SQL-запрос: выбери сотрудника IT с наибольшей зарплатой.
      </p>

      {tableData.length > 0 && (
        <div>
          <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            ТАБЛИЦА museum_staff:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--fg-dim)' }}>
                {['id', 'name', 'dept', 'salary'].map(col => (
                  <th key={col} style={{ padding: '0.2rem 0.5rem', textAlign: 'left' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(0,255,0,0.1)' }}>
                  {['id', 'name', 'dept', 'salary'].map(col => (
                    <td key={col} style={{ padding: '0.2rem 0.5rem', color: 'var(--fg)' }}>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <p style={{ color: 'var(--fg-dim)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
          SQL РЕДАКТОР:
        </p>
        <textarea
          className="terminal-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={6}
          disabled={locked}
          style={{
            resize: 'vertical',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        />
      </div>

      <button
        className="terminal-btn"
        onClick={handleExecute}
        disabled={locked || !query.trim()}
      >
        [ВЫПОЛНИТЬ ЗАПРОС]
      </button>
    </div>
  );

  const rightContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>РЕЗУЛЬТАТ ЗАПРОСА:</p>

      {queryError && (
        <div className="terminal-error" style={{ padding: '0.5rem', fontSize: '0.8rem', border: '1px solid #ff4444' }}>
          {queryError}
        </div>
      )}

      {queryResult && queryResult.length > 0 && (
        <div style={{ border: '1px solid var(--fg-dim)', padding: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: 'var(--fg-dim)', borderBottom: '1px solid var(--fg-dim)' }}>
                {Object.keys(queryResult[0]).map(col => (
                  <th key={col} style={{ padding: '0.2rem 0.4rem', textAlign: 'left' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} style={{ padding: '0.2rem 0.4rem', color: 'var(--fg-bright)' }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '0.5rem', border: '1px solid var(--fg-dim)', fontSize: '0.75rem' }}>
        <p style={{ color: 'var(--fg-dim)', marginBottom: '0.3rem' }}>ПОДСКАЗКА ПО СИНТАКСИСУ:</p>
        <p style={{ color: 'var(--fg-dim)' }}>SELECT col FROM table</p>
        <p style={{ color: 'var(--fg-dim)' }}>WHERE col = 'value'</p>
        <p style={{ color: 'var(--fg-dim)' }}>ORDER BY col DESC</p>
        <p style={{ color: 'var(--fg-dim)' }}>LIMIT n</p>
      </div>
    </div>
  );

  return (
    <NodeLayout
      nodeId={nodeId}
      title="УЗЕЛ 6"
      person="Эдгар Кодд"
      bio="Создатель реляционной модели данных. Разработал язык SQL."
      hint="SELECT name FROM museum_staff WHERE dept = 'IT' ORDER BY salary DESC LIMIT 1"
      attempts={attempts}
      maxAttempts={maxAttempts}
      feedback={feedback}
      centerContent={centerContent}
      rightContent={rightContent}
    />
  );
}
