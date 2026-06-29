import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/today',    label: 'Today',    icon: '⚡' },
  { to: '/goals',    label: 'Goals',    icon: '🎯' },
  { to: '/habits',   label: 'Habits',   icon: '🔁' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/review',   label: 'Review',   icon: '📋' },
];

export default function Nav() {
  return (
    <>
      <header className="top-bar">
        <span className="nav-wordmark">bee hour</span>
      </header>
      <nav className="bottom-nav">
        {TABS.map(t => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `bottom-tab${isActive ? ' bottom-tab--active' : ''}`}>
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
