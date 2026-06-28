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
        <Link to="/balance" className="tool-link">
          <span className="tool-link-name">balance</span>
          <span className="tool-link-desc">five questions, three scores, right now</span>
        </Link>
        <Link to="/reset" className="tool-link">
          <span className="tool-link-name">5 minutes</span>
          <span className="tool-link-desc">a small reset you can do right now</span>
        </Link>
      </div>
    </>
  );
}
