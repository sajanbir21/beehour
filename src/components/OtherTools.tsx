import { Link, useLocation } from 'react-router-dom';

const ALL_TOOLS = [
  { to: '/ai-mirror',     name: 'The AI Mirror',           desc: 'Name an AI tool. See what it asks back.' },
  { to: '/your-question', name: 'Your Question for Today',  desc: 'One hand-written question to sit with.' },
  { to: '/how-are-you',   name: 'How Are You, Actually',   desc: 'Five honest questions — Clarity, Calm, Energy.' },
  { to: '/quick-reset',   name: 'Your Quick Reset',        desc: 'Think + listen + move. Back in five minutes.' },
];

export default function OtherTools() {
  const { pathname } = useLocation();
  const others = ALL_TOOLS.filter(t => t.to !== pathname);

  return (
    <div className="other-tools">
      <p className="other-tools-label">Other tools</p>
      <div className="other-tools-list">
        {others.map(t => (
          <Link key={t.to} to={t.to} className="other-tool-row">
            <span className="other-tool-name">{t.name}</span>
            <span className="other-tool-desc">{t.desc}</span>
            <span className="other-tool-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
