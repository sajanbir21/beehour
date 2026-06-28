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
          <p className="footer-text">a personal project — the hour you give to yourself</p>
        </div>
      </footer>
    </div>
  );
}
