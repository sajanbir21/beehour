import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="page-wrapper">
      <nav>
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-wordmark">bee hour</Link>
            <ul className="nav-links">
              <li>
                <Link to="/" className={pathname === '/' ? 'nav-active' : ''}>
                  home
                </Link>
              </li>
              <li>
                <Link to="/about" className={pathname === '/about' ? 'nav-active' : ''}>
                  about
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">{children}</div>
      </main>

      <footer>
        <div className="container">
          <div className="footer-inner">
            <p className="footer-text">a personal project — the hour you give to yourself</p>
            <a
              href="https://www.instagram.com/saajan.shergill/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-insta"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              @saajan.shergill
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
