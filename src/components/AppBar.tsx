import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function AppBar() {
  return (
    <header className="appbar">
      <Link to="/" className="appbar-brand" aria-label="AI Engineer Roadmap — home">
        <span className="appbar-mark" aria-hidden="true" />
        <span className="appbar-name">
          AI Engineer <span className="appbar-name-accent">Roadmap</span>
        </span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
