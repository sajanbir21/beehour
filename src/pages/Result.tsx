import { useRef } from 'react';
import { PATTERNS } from '../data/patterns';
import type { ScoreResult } from '../utils/scoring';

interface Props {
  result: ScoreResult;
  onRetake: () => void;
}

const READINESS_COPY = {
  low:    { label: 'Low readiness', tip: 'Start with the absolute smallest version. Pressure makes it worse.' },
  medium: { label: 'Medium readiness', tip: 'You have the structure. Focus on one change at a time.' },
  high:   { label: 'High readiness', tip: 'You are ready. Commit to the 7-day plan and track daily.' },
};

export default function Result({ result, onRetake }: Props) {
  const pattern = PATTERNS[result.primary];
  const secondary = result.secondary ? PATTERNS[result.secondary] : null;
  const readiness = READINESS_COPY[result.readinessLevel];
  const shareRef = useRef<HTMLDivElement>(null);

  return (
    <div className="result-page">
      {/* Result header */}
      <div className="result-hero" style={{ '--pattern-color': pattern.color } as React.CSSProperties}>
        <span className="result-emoji">{pattern.emoji}</span>
        <span className="result-eyebrow">Your Brain Pattern</span>
        <h1 className="result-name">{pattern.name}</h1>
        <p className="result-tagline">{pattern.tagline}</p>
      </div>

      <div className="result-body">
        {/* Why it happened */}
        <section className="result-section">
          <h2 className="result-section-title">Why this is happening</h2>
          <p className="result-text">{pattern.whyItHappens}</p>
        </section>

        {/* Signs */}
        <section className="result-section">
          <h2 className="result-section-title">What it looks like</h2>
          <ul className="result-signs">
            {pattern.signs.map((s, i) => (
              <li key={i} className="result-sign-item">
                <span className="sign-dot" />
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Real-life example */}
        <section className="result-section result-section--example">
          <span className="example-label">Real-life example</span>
          <p className="example-text">"{pattern.realLifeExample}"</p>
        </section>

        {/* Smallest fix */}
        <section className="result-fix">
          <div className="fix-header">
            <span className="fix-badge">Smallest fix today</span>
          </div>
          <p className="fix-action">{pattern.smallestFix}</p>
          <p className="fix-detail">{pattern.fixDetail}</p>
        </section>

        {/* 7-day plan */}
        <section className="result-section">
          <h2 className="result-section-title">Your 7-day reset plan</h2>
          <ol className="seven-day-list">
            {pattern.sevenDayPlan.map((item, i) => (
              <li key={i} className="seven-day-item">
                <span className="day-num">Day {i + 1}</span>
                <span className="day-text">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Readiness scores */}
        <section className="result-section readiness-section">
          <h2 className="result-section-title">Your readiness</h2>
          <div className="readiness-chips">
            <div className="readiness-chip">
              <span className="chip-num">{result.importance}/10</span>
              <span className="chip-label">Importance</span>
            </div>
            <div className="readiness-chip">
              <span className="chip-num">{result.confidence}/10</span>
              <span className="chip-label">Confidence</span>
            </div>
            <div className="readiness-chip readiness-chip--level">
              <span className="chip-num chip-num--level">{readiness.label}</span>
              <span className="chip-label">Readiness</span>
            </div>
          </div>
          <p className="readiness-tip">{readiness.tip}</p>
          <p className="confidence-label">You {result.confidenceLabel}.</p>
        </section>

        {/* Secondary pattern */}
        {secondary && (
          <section className="result-section secondary-section">
            <h2 className="result-section-title">Secondary pattern</h2>
            <div className="secondary-card" style={{ '--secondary-color': secondary.color } as React.CSSProperties}>
              <span className="secondary-emoji">{secondary.emoji}</span>
              <div>
                <span className="secondary-name">{secondary.name}</span>
                <p className="secondary-tagline">{secondary.tagline}</p>
              </div>
            </div>
            {result.isBlended && (
              <p className="blended-note">Your scores were close — this secondary pattern is almost as strong as your primary one.</p>
            )}
          </section>
        )}

        {/* Share card */}
        <section className="result-section">
          <h2 className="result-section-title">Share your result</h2>
          <div className="share-card" ref={shareRef} style={{ '--pattern-color': pattern.color } as React.CSSProperties}>
            <span className="share-card-site">bee hour · habit audit</span>
            <span className="share-card-emoji">{pattern.emoji}</span>
            <p className="share-card-pattern">{pattern.name}</p>
            <p className="share-card-liner">{pattern.shareOneLiner}</p>
            <span className="share-card-cta">beehour.app</span>
          </div>
          <p className="share-hint">Screenshot this card and share it on your story.</p>
        </section>

        {/* CTA */}
        <div className="result-cta">
          <p className="cta-headline">{pattern.ctaText}</p>
          <p className="cta-sub">Bookmark this page and check back each day for the next step.</p>
          <button className="btn-primary btn-primary--full" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Review my plan ↑
          </button>
          <button className="btn-ghost" onClick={onRetake}>Retake the audit</button>
        </div>
      </div>
    </div>
  );
}
