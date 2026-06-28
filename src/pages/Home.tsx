import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="home-intro">
        <h1 className="page-title">bee hour</h1>
        <p className="home-tagline">the hour you give to yourself</p>
      </div>

      <div className="home-tools">
        <Link to="/ai-mirror" className="tool-link">
          <span className="tool-link-name">the ai mirror</span>
          <span className="tool-link-desc">name an AI tool — see what it asks back about being human</span>
        </Link>
        <Link to="/your-question" className="tool-link">
          <span className="tool-link-name">your question for today</span>
          <span className="tool-link-desc">one hand-written question to sit with</span>
        </Link>
        <Link to="/how-are-you" className="tool-link">
          <span className="tool-link-name">how are you, actually</span>
          <span className="tool-link-desc">five honest questions — clarity, calm, energy</span>
        </Link>
        <Link to="/quick-reset" className="tool-link">
          <span className="tool-link-name">your quick reset</span>
          <span className="tool-link-desc">think + listen + move — your next five minutes</span>
        </Link>
      </div>
    </>
  );
}
