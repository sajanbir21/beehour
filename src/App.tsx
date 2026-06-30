import { useState } from 'react';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import { computeScores } from './utils/scoring';
import type { Answers, ScoreResult } from './utils/scoring';

export default function App() {
  const [result, setResult] = useState<ScoreResult | null>(null);

  function handleComplete(answers: Answers) {
    setResult(computeScores(answers));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRetake() {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      {result
        ? <Result result={result} onRetake={handleRetake} />
        : <Quiz onComplete={handleComplete} />
      }
    </div>
  );
}
