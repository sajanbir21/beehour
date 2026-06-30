import { useState } from 'react';
import { QUESTIONS, SCALE_LABELS_4 } from '../data/questions';
import type { Answers } from '../utils/scoring';

interface Props {
  onComplete: (answers: Answers) => void;
}

export default function Quiz({ onComplete }: Props) {
  const [step, setStep] = useState<'intro' | number>('intro');
  const [answers, setAnswers] = useState<Answers>({});

  const totalQ = QUESTIONS.length;
  const currentIdx = typeof step === 'number' ? step : 0;
  const current = QUESTIONS[currentIdx];
  const progress = typeof step === 'number' ? ((currentIdx) / totalQ) * 100 : 0;

  function answer(val: number) {
    const updated = { ...answers, [current.id]: val };
    setAnswers(updated);
    if (currentIdx < totalQ - 1) {
      setStep(currentIdx + 1);
    } else {
      onComplete(updated);
    }
  }

  function goBack() {
    if (currentIdx === 0) setStep('intro');
    else setStep(currentIdx - 1);
  }

  if (step === 'intro') {
    return (
      <div className="quiz-intro">
        <div className="quiz-intro-inner">
          <span className="quiz-eyebrow">3-minute audit</span>
          <h1 className="quiz-intro-heading">Find out why you keep breaking your routine.</h1>
          <p className="quiz-intro-sub">
            10 honest questions. You'll discover your brain's habit pattern and get one small fix you can use today.
          </p>
          <div className="quiz-intro-badges">
            <span className="badge">🧠 Psychology-based</span>
            <span className="badge">⚡ 3 minutes</span>
            <span className="badge">🎯 Personalised result</span>
          </div>
          <button className="btn-primary" onClick={() => setStep(0)}>Start the Habit Audit →</button>
          <p className="quiz-intro-note">No sign-up. No email required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="back-btn" onClick={goBack} aria-label="Go back">←</button>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="q-counter">{currentIdx + 1}/{totalQ}</span>
      </div>

      <div className="quiz-body">
        <span className="q-type-label">
          {current.type === 'readiness' ? (currentIdx === 8 ? 'Importance' : 'Confidence') : `Question ${currentIdx + 1}`}
        </span>
        <p className="q-text">{current.text}</p>

        {current.scale === '0-4' && (
          <div className="scale-options">
            {SCALE_LABELS_4.map((label, i) => (
              <button
                key={i}
                className={`scale-btn${answers[current.id] === i ? ' scale-btn--active' : ''}`}
                onClick={() => answer(i)}
              >
                <span className="scale-num">{i}</span>
                <span className="scale-label">{label}</span>
              </button>
            ))}
          </div>
        )}

        {current.scale === '0-10' && (
          <div className="scale-10-wrap">
            <div className="scale-10-grid">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  className={`scale-10-btn${answers[current.id] === i ? ' scale-10-btn--active' : ''}`}
                  onClick={() => answer(i)}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="scale-10-labels">
              <span>Not at all</span>
              <span>Completely</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
