import { useState } from 'react';

/*
 Scoring logic:
   Clarity = average(Q1_clarity, Q4_selfTime mapped 0→0 / 100→100)
   Calm    = average(Q2_calm, Q5_avoiding inverted: yes→20, no→80)
   Energy  = Q3_energy

 Q4 (done something for yourself): yes=100, no=0
 Q5 (avoiding something): yes=20 (dragging on calm), no=100
*/

const QUESTIONS = [
  { id: 'clarity', label: 'How clear does your head feel right now?', type: 'slider' },
  { id: 'calm',    label: 'How calm do you feel right now?',          type: 'slider' },
  { id: 'energy',  label: 'How much energy do you have right now?',   type: 'slider' },
  { id: 'selfTime',  label: 'Have you done anything today just for yourself?', type: 'yesno' },
  { id: 'avoiding',  label: 'Is there something you\'re avoiding right now?',  type: 'yesno' },
] as const;

type QuestionId = typeof QUESTIONS[number]['id'];
type Answers = Partial<Record<QuestionId, number>>;

function computeScores(a: Answers) {
  const selfTimeVal = a.selfTime ?? 50;
  const avoidingVal = a.avoiding ?? 50;
  const clarity = Math.round(((a.clarity ?? 50) + selfTimeVal) / 2);
  const calm    = Math.round(((a.calm ?? 50) + avoidingVal) / 2);
  const energy  = a.energy ?? 50;
  return { clarity, calm, energy };
}

export default function Balance() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const current = QUESTIONS[step];

  function setAnswer(id: QuestionId, value: number) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  function handleNext() {
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
    }
  }

  function handleBack() {
    setStep(s => s - 1);
  }

  function handleReset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  const scores = computeScores(answers);
  const currentAnswer = answers[current?.id];
  const canAdvance = currentAnswer !== undefined;

  if (done) {
    return (
      <>
        <h1 className="page-title">balance</h1>
        <p className="page-subtitle">here's where you are right now.</p>

        <div className="card card--dusk balance-result">
          <div className="balance-scores">
            <ScoreRow label="Clarity" value={scores.clarity} />
            <ScoreRow label="Calm"    value={scores.calm} />
            <ScoreRow label="Energy"  value={scores.energy} />
          </div>
          <span className="card-watermark">beehour.app/balance</span>
        </div>

        <div className="result-actions">
          <button className="btn-secondary" onClick={handleReset}>
            take it again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">balance</h1>
      <p className="page-subtitle">five questions. honest answers only.</p>

      <div className="balance-progress">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`balance-dot ${i < step ? 'balance-dot--done' : i === step ? 'balance-dot--active' : ''}`}
          />
        ))}
      </div>

      <div className="card card--dusk balance-card">
        <p className="balance-question">{current.label}</p>

        {current.type === 'slider' && (
          <div className="balance-slider-wrap">
            <input
              type="range"
              min={0}
              max={100}
              value={currentAnswer ?? 50}
              onChange={e => setAnswer(current.id, Number(e.target.value))}
              className="balance-slider"
              aria-label={current.label}
            />
            <div className="balance-slider-labels">
              <span>not really</span>
              <span className="balance-slider-value">{currentAnswer ?? 50}</span>
              <span>completely</span>
            </div>
          </div>
        )}

        {current.type === 'yesno' && (
          <div className="balance-yesno">
            <button
              className={`balance-yn-btn ${currentAnswer === 100 ? 'balance-yn-btn--selected' : 'btn-secondary'}`}
              onClick={() => setAnswer(current.id, 100)}
            >
              yes
            </button>
            <button
              className={`balance-yn-btn ${currentAnswer === 0 ? 'balance-yn-btn--selected' : 'btn-secondary'}`}
              onClick={() => setAnswer(current.id, 0)}
            >
              no
            </button>
          </div>
        )}
      </div>

      <div className="balance-nav">
        {step > 0 && (
          <button className="btn-secondary" onClick={handleBack}>back</button>
        )}
        <button onClick={handleNext} disabled={!canAdvance}>
          {step === QUESTIONS.length - 1 ? 'see results' : 'next'}
        </button>
      </div>
    </>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-row">
      <span className="score-label">{label}</span>
      <div className="score-bar-wrap">
        <div className="score-bar" style={{ width: `${value}%` }} />
      </div>
      <span className="score-value">{value}</span>
    </div>
  );
}
