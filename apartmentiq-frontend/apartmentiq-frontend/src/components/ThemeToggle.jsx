import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{
      background: 'var(--sur2)',
      border: '1px solid var(--bor2)',
      borderRadius: '8px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '16px',
    }}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}