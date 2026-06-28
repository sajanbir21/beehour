import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="home-intro">
        <h1 className="page-title">bee hour</h1>
        <p className="home-tagline">the hour you give to yourself</p>
      </div>

      <div className="home-tools">
        <Link to="/mind" className="tool-link">
          <span className="tool-link-name">mind</span>
          <span className="tool-link-desc">what your AI tools ask back</span>
        </Link>
        <Link to="/soul" className="tool-link">
          <span className="tool-link-name">soul</span>
          <span className="tool-link-desc">one thought, however long you need it</span>
        </Link>
        {/* body — coming soon */}
        <span className="tool-link tool-link--disabled">
          <span className="tool-link-name">body</span>
          <span className="tool-link-desc">coming soon</span>
        </span>
        {/* balance — coming soon */}
        <span className="tool-link tool-link--disabled">
          <span className="tool-link-name">balance</span>
          <span className="tool-link-desc">coming soon</span>
        </span>
      </div>
    </>
  );
}
