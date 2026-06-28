import { useState } from 'react';
import OtherTools from '../components/OtherTools';

/*
 Scoring:
   Clarity = avg(Q1_headClarity, Q4_selfTime: yes=100/no=0)
   Calm    = avg(Q2_calm, Q5_avoiding inverted: yes=20/no=100)
   Energy  = Q3_energy

 Dominant lens = whichever of the three scores highest.
 If all three within 12 points of each other → "balanced" result.
*/

const QUESTIONS = [
  { id: 'clarity',  label: 'How clear does your head feel right now?',            type: 'slider' },
  { id: 'calm',     label: 'How calm do you feel in this moment?',                 type: 'slider' },
  { id: 'energy',   label: 'How much physical energy are you carrying right now?', type: 'slider' },
  { id: 'selfTime', label: 'Have you done anything today that was purely for you?', type: 'yesno' },
  { id: 'avoiding', label: 'Is there something specific you\'re avoiding right now?', type: 'yesno' },
] as const;

type QuestionId = typeof QUESTIONS[number]['id'];
type Answers = Partial<Record<QuestionId, number>>;

const LENS_DESCRIPTORS: Record<string, { title: string; line: string }> = {
  clarity: {
    title: 'You\'re leading with clarity right now.',
    line:  'Your thoughts are accessible. This might be a good moment to make a decision, start something, or have a conversation you\'ve been putting off.',
  },
  calm: {
    title: 'You\'re in a calm space right now.',
    line:  'Something has settled. Notice it — it doesn\'t always stay. This is a good time to reflect rather than act.',
  },
  energy: {
    title: 'You have energy to spend right now.',
    line:  'There\'s fuel here. The question is whether you\'re pointing it at something that matters to you.',
  },
  balanced: {
    title: 'You\'re fairly balanced across all three right now.',
    line:  'Clarity, calm, and energy are close. That\'s rarer than it sounds — it might be worth noticing.',
  },
};

function computeScores(a: Answers) {
  const clarity = Math.round(((a.clarity ?? 50) + (a.selfTime ?? 50)) / 2);
  const calm    = Math.round(((a.calm ?? 50)    + (a.avoiding ?? 50)) / 2);
  const energy  = a.energy ?? 50;
  return { clarity, calm, energy };
}

function getDominantLens(scores: ReturnType<typeof computeScores>): string {
  const { clarity, calm, energy } = scores;
  const max = Math.max(clarity, calm, energy);
  const min = Math.min(clarity, calm, energy);
  if (max - min <= 12) return 'balanced';
  if (clarity === max) return 'clarity';
  if (calm === max) return 'calm';
  return 'energy';
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
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
    else setDone(true);
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
  const dominantLens = getDominantLens(scores);
  const descriptor = LENS_DESCRIPTORS[dominantLens];
  const currentAnswer = answers[current?.id];
  const canAdvance = currentAnswer !== undefined;

  if (done) {
    return (
      <>
        <h1 className="page-title">How Are You, Actually</h1>
        <p className="page-subtitle">Here's where you actually are right now.</p>

        <div className="card card--dusk balance-result">
          <p className="balance-lens-title">{descriptor.title}</p>
          <p className="balance-lens-line">{descriptor.line}</p>

          <div className="balance-scores">
            <ScoreRow label="Clarity" value={scores.clarity} highlight={dominantLens === 'clarity'} />
            <ScoreRow label="Calm"    value={scores.calm}    highlight={dominantLens === 'calm'} />
            <ScoreRow label="Energy"  value={scores.energy}  highlight={dominantLens === 'energy'} />
          </div>
          <span className="card-watermark">beehour.app/how-are-you</span>
        </div>

        <div className="result-actions">
          <button className="btn-secondary" onClick={handleReset}>take it again</button>
        </div>

        <OtherTools />
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">How Are You, Actually</h1>
      <p className="page-subtitle">Five honest questions. You'll know something at the end.</p>

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
          {step === QUESTIONS.length - 1 ? 'see my lens' : 'next'}
        </button>
      </div>
    </>
  );
}

function ScoreRow({ label, value, highlight }: { label: string; value: number; highlight: boolean }) {
  return (
    <div className={`score-row ${highlight ? 'score-row--highlight' : ''}`}>
      <span className="score-label">{label}</span>
      <div className="score-bar-wrap">
        <div className="score-bar" style={{ width: `${value}%` }} />
      </div>
      <span className="score-value">{value}</span>
    </div>
  );
}
