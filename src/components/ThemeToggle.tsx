import { useTheme } from '../lib/ThemeContext';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button
      type="button"
      className={`theme-switch${isDark ? ' is-dark' : ' is-light'}`}
      onClick={toggle}
      aria-label={label}
      title={label}
      role="switch"
      aria-checked={isDark}
    >
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-ico sun">☀</span>
        <span className="theme-switch-ico moon">☾</span>
        <span className="theme-switch-knob">{isDark ? '☾' : '☀'}</span>
      </span>
    </button>
  );
}
