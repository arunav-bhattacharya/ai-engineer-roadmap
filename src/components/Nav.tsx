import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/fast-track', label: 'Fast-Track' },
  { to: '/complete-plan', label: 'Complete Plan' },
  { to: '/certifications', label: 'Certifications' },
];

export function Nav() {
  return (
    <nav className="tabs" aria-label="Primary">
      <div className="tabs-inner">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `tab${isActive ? ' tab-active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
