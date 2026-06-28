import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="home-intro">
        <h1 className="page-title">bee hour</h1>
        <p className="home-tagline">the hour you give to yourself</p>
      </div>

      <div className="home-tools">
        <Link to="/ai-curiosity" className="tool-link">
          <span className="tool-link-name">ai curiosity</span>
          <span className="tool-link-desc">what your AI tools ask back</span>
        </Link>
        <Link to="/daily-prompt" className="tool-link">
          <span className="tool-link-name">daily prompt</span>
          <span className="tool-link-desc">one thought, however long you need it</span>
        </Link>
        {/* body reset — coming soon */}
        <span className="tool-link tool-link--disabled">
          <span className="tool-link-name">body reset</span>
          <span className="tool-link-desc">a 5-minute reset, any time — coming soon</span>
        </span>
        {/* balance quiz — coming soon */}
        <span className="tool-link tool-link--disabled">
          <span className="tool-link-name">balance</span>
          <span className="tool-link-desc">a short check-in across all three — coming soon</span>
        </span>
      </div>
    </>
  );
}
