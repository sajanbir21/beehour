import { useState, useEffect } from 'react';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import { computeScores } from './utils/scoring';
import type { Answers, ScoreResult } from './utils/scoring';

const REVEAL_STEPS = [
  'Reading your answers…',
  'Identifying your brain pattern…',
  'Building your personalised plan…',
];

export default function App() {
  const [phase, setPhase] = useState<'quiz' | 'reveal' | 'result'>('quiz');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [habitName, setHabitName] = useState('your habit');
  const [revealStep, setRevealStep] = useState(0);

  function handleComplete(answers: Answers, name: string) {
    setResult(computeScores(answers));
    setHabitName(name);
    setRevealStep(0);
    setPhase('reveal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (phase !== 'reveal') return;
    if (revealStep < REVEAL_STEPS.length - 1) {
      const t = setTimeout(() => setRevealStep(s => s + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase('result'), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, revealStep]);

  function handleRetake() {
    setResult(null);
    setPhase('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (phase === 'reveal') {
    return (
      <div className="app">
        <div className="reveal-screen">
          <div className="reveal-inner">
            <div className="reveal-spinner">
              <div className="spinner-ring" />
            </div>
            <p className="reveal-step">{REVEAL_STEPS[revealStep]}</p>
            <div className="reveal-dots">
              {REVEAL_STEPS.map((_, i) => (
                <span key={i} className={`reveal-dot${i <= revealStep ? ' reveal-dot--active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {phase === 'result' && result
        ? <Result result={result} habitName={habitName} onRetake={handleRetake} />
        : <Quiz onComplete={handleComplete} />
      }
    </div>
  );
}
