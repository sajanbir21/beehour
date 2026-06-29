import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav-wordmark">bee hour</span>
      <ul className="nav-links">
        <li><NavLink to="/today" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Today</NavLink></li>
        <li><NavLink to="/goals" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Goals</NavLink></li>
        <li><NavLink to="/review" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Review</NavLink></li>
      </ul>
    </nav>
  );
}
