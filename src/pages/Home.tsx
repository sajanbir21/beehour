import { Link } from 'react-router-dom';

const TOOLS = [
  {
    to: '/ai-mirror',
    name: 'the ai mirror',
    hook: 'Name an AI tool. Get back a question that\'ll stay with you.',
    cta: 'try it →',
  },
  {
    to: '/your-question',
    name: 'your question for today',
    hook: 'One question, written by hand. Sit with it for a minute.',
    cta: 'get your question →',
  },
  {
    to: '/how-are-you',
    name: 'how are you, actually',
    hook: 'Five honest questions. Find out where you really are right now.',
    cta: 'check in →',
  },
  {
    to: '/quick-reset',
    name: 'your quick reset',
    hook: 'One tap. Think, listen, move. Back in five minutes.',
    cta: 'reset now →',
  },
];

export default function Home() {
  return (
    <>
      <div className="home-hero">
        <h1 className="home-wordmark">bee hour</h1>
        <p className="home-tagline">small tools for the hour you give to yourself</p>
      </div>

      <div className="home-tool-grid">
        {TOOLS.map(tool => (
          <Link key={tool.to} to={tool.to} className="tool-card">
            <div className="tool-card-body">
              <h2 className="tool-card-name">{tool.name}</h2>
              <p className="tool-card-hook">{tool.hook}</p>
            </div>
            <span className="tool-card-cta">{tool.cta}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
