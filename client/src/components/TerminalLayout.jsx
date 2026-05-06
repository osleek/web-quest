import '../styles/terminal.css';
import '../styles/scanlines.css';

export default function TerminalLayout({ children }) {
  return (
    <div className="crt-container" style={{ minHeight: '100vh' }}>
      <div className="terminal-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
        {children}
      </div>
    </div>
  );
}
