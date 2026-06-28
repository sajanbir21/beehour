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
                <Link to="/ai-curiosity" className={pathname === '/ai-curiosity' ? 'nav-active' : ''}>
                  ai curiosity
                </Link>
              </li>
              <li>
                <Link to="/daily-prompt" className={pathname === '/daily-prompt' ? 'nav-active' : ''}>
                  daily prompt
                </Link>
              </li>
              {/* body reset — coming soon */}
              <li><span className="nav-soon">body reset</span></li>
              {/* balance quiz — coming soon */}
              <li><span className="nav-soon">balance</span></li>
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
