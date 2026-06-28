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
                <Link to="/ai-mirror" className={pathname === '/ai-mirror' ? 'nav-active' : ''}>
                  the ai mirror
                </Link>
              </li>
              <li>
                <Link to="/your-question" className={pathname === '/your-question' ? 'nav-active' : ''}>
                  your question
                </Link>
              </li>
              <li>
                <Link to="/how-are-you" className={pathname === '/how-are-you' ? 'nav-active' : ''}>
                  how are you, actually
                </Link>
              </li>
              <li>
                <Link to="/quick-reset" className={pathname === '/quick-reset' ? 'nav-active' : ''}>
                  quick reset
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
