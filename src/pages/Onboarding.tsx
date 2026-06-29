import { useState } from 'react';
import type { Goal, GoalType, Importance } from '../types';
import { saveGoals, setOnboarded } from '../utils/storage';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const GOAL_EXAMPLES = [
  'Get fitter and stronger',
  'Build a side project',
  'Read more consistently',
  'Improve my focus',
  'Grow professionally',
  'Sleep and recover better',
];

interface DraftGoal { name: string; type: GoalType; importance: Importance; }

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<'intro' | 'braindump' | 'top5' | 'done'>('intro');
  const [braindump, setBraindump] = useState<string[]>(['', '', '', '', '', '', '']);
  const [selected, setSelected] = useState<number[]>([]);
  const [drafts, setDrafts] = useState<DraftGoal[]>([]);

  function handleBraindumpChange(i: number, val: string) {
    setBraindump(prev => { const n = [...prev]; n[i] = val; return n; });
  }

  function goToTop5() {
    const filled = braindump.map((v, i) => ({ val: v.trim(), i })).filter(x => x.val);
    if (filled.length === 0) return;
    setStep('top5');
  }

  function toggleSelect(i: number) {
    setSelected(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 5 ? [...prev, i] : prev
    );
  }

  function confirmTop5() {
    const filled = braindump.filter(v => v.trim());
    const top5 = selected.map(i => filled[i]).filter(Boolean);
    setDrafts(top5.map(name => ({ name, type: 'personal', importance: 'high' })));
    setStep('done');
  }

  function updateDraft(i: number, key: keyof DraftGoal, val: string) {
    setDrafts(prev => { const n = [...prev]; n[i] = { ...n[i], [key]: val }; return n; });
  }

  function finish() {
    const goals: Goal[] = drafts.map(d => ({
      id: uid(),
      name: d.name,
      type: d.type,
      importance: d.importance,
      status: 'active',
      createdAt: new Date().toISOString(),
    }));
    saveGoals(goals);
    setOnboarded();
    onDone();
  }

  const filledGoals = braindump.filter(v => v.trim());

  if (step === 'intro') return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        <span className="onboard-label">bee hour</span>
        <h1 className="onboard-heading">Clarity before execution.</h1>
        <p className="onboard-sub">Most people fail not from lack of ambition — but from too many goals and no real system. This takes 2 minutes to set up.</p>
        <button className="btn-signal" onClick={() => setStep('braindump')}>Get started →</button>
      </div>
    </div>
  );

  if (step === 'braindump') return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        <span className="onboard-label">Step 1 of 2 — Warren Buffett 5/25</span>
        <h2 className="onboard-heading">Write down everything you want to achieve.</h2>
        <p className="onboard-sub">Don't filter. Just brain-dump. Up to 7 goals or areas you're thinking about.</p>
        <div className="braindump-list">
          {braindump.map((v, i) => (
            <input
              key={i}
              className="form-input"
              placeholder={GOAL_EXAMPLES[i] ?? `Goal ${i + 1}`}
              value={v}
              onChange={e => handleBraindumpChange(i, e.target.value)}
            />
          ))}
        </div>
        <button className="btn-signal" onClick={goToTop5} disabled={filledGoals.length === 0}>
          Next — pick your top 5 →
        </button>
      </div>
    </div>
  );

  if (step === 'top5') {
    const filled = braindump.filter(v => v.trim());
    return (
      <div className="onboard-wrap">
        <div className="onboard-card">
          <span className="onboard-label">Step 2 of 2 — Warren Buffett 5/25</span>
          <h2 className="onboard-heading">Now pick your top 5.</h2>
          <p className="onboard-sub">Everything you don't pick goes on your avoid-at-all-costs list. That's the rule.</p>
          <div className="top5-list">
            {filled.map((g, i) => (
              <button
                key={i}
                className={`top5-item${selected.includes(i) ? ' top5-item--selected' : ''}`}
                onClick={() => toggleSelect(i)}
              >
                <span className="top5-rank">{selected.includes(i) ? selected.indexOf(i) + 1 : '—'}</span>
                {g}
              </button>
            ))}
          </div>
          <p className="top5-count">{selected.length}/5 selected</p>
          <button className="btn-signal" onClick={confirmTop5} disabled={selected.length === 0}>
            Confirm my top {selected.length} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        <span className="onboard-label">Almost done</span>
        <h2 className="onboard-heading">Set goal type and importance.</h2>
        <p className="onboard-sub">This helps the app prioritize your daily tasks correctly.</p>
        <div className="goal-setup-list">
          {drafts.map((d, i) => (
            <div key={i} className="goal-setup-row">
              <span className="goal-setup-name">{d.name}</span>
              <div className="goal-setup-controls">
                <select className="form-select" value={d.type} onChange={e => updateDraft(i, 'type', e.target.value)}>
                  <option value="fitness">Fitness</option>
                  <option value="career">Career</option>
                  <option value="personal">Personal</option>
                  <option value="mixed">Mixed</option>
                </select>
                <div className="importance-group">
                  {(['high', 'medium', 'low'] as Importance[]).map(imp => (
                    <button
                      key={imp}
                      className={`importance-btn${d.importance === imp ? ' importance-btn--active' : ''}`}
                      onClick={() => updateDraft(i, 'importance', imp)}
                    >{imp}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-signal" onClick={finish}>Enter Growth OS →</button>
      </div>
    </div>
  );
}
