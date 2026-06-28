import { Link } from 'react-router-dom';

const TOOLS = [
  { to: '/ai-mirror',     name: 'The AI Mirror',          desc: 'Name an AI tool. See what it asks back.' },
  { to: '/your-question', name: 'Your Question for Today', desc: 'One hand-written question to sit with.' },
  { to: '/how-are-you',   name: 'How Are You, Actually',  desc: 'Five honest questions — Clarity, Calm, Energy.' },
  { to: '/quick-reset',   name: 'Your Quick Reset',       desc: 'Think + listen + move. Back in five minutes.' },
];

export default function About() {
  return (
    <>
      <div className="about-header">
        <div className="about-photo-wrap">
          <img
            src="/images/sajan_photo.jpeg"
            alt="Sajanbir Singh"
            className="about-photo"
          />
        </div>
        <div className="about-header-text">
          <h1 className="about-name">Sajanbir Singh</h1>
          <p className="about-tagline">Builder. Curious person. Making things for quieter problems.</p>
        </div>
      </div>

      <div className="about-bio-section">
        <p className="about-bio">
          BEE HOUR started as an hour I was trying to give myself, most days,
          without much of a plan. These are a few small things that came out of
          that — nothing polished, nothing finished. If one of them is useful to
          you for five minutes, that's the whole point.
        </p>
        <p className="about-bio">
          I built this because I kept making tools for other people's problems
          and wanted to make something for the quieter ones — the kind that don't
          have a product brief or a deadline, just a feeling you keep coming back to.
        </p>
      </div>

      <div className="about-tools-section">
        <p className="about-tools-label">The tools</p>
        <div className="about-tools-list">
          {TOOLS.map(t => (
            <Link key={t.to} to={t.to} className="about-tool-row">
              <span className="about-tool-name">{t.name}</span>
              <span className="about-tool-desc">{t.desc}</span>
              <span className="about-tool-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
