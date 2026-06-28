import { useState } from 'react';
import { reflectiveQuestions } from '../data/reflectiveQuestions';
import { soundPrompts } from '../data/soundPrompts';
import { movementPrompts } from '../data/movementPrompts';

function pick<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter(x => x !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface ResetSet {
  thought: string;
  sound: string;
  move: string;
}

function getNewReset(prev?: ResetSet): ResetSet {
  return {
    thought: pick(reflectiveQuestions, prev?.thought),
    sound:   pick(soundPrompts,        prev?.sound),
    move:    pick(movementPrompts,     prev?.move),
  };
}

export default function Reset() {
  const [reset, setReset] = useState<ResetSet | null>(null);

  function handleGenerate() {
    setReset(r => getNewReset(r ?? undefined));
  }

  return (
    <>
      <h1 className="page-title">5 minutes</h1>
      <p className="page-subtitle">
        {reset
          ? 'your reset. do all three, in order, without your phone.'
          : 'one button. three things. that\'s your next five minutes.'}
      </p>

      {!reset ? (
        <button onClick={handleGenerate}>give me a reset</button>
      ) : (
        <>
          <div className="card card--dusk reset-card">
            <ol className="reset-list">
              <li className="reset-item">
                <span className="reset-marker">think</span>
                {reset.thought}
              </li>
              <li className="reset-item">
                <span className="reset-marker">listen</span>
                {reset.sound}
              </li>
              <li className="reset-item">
                <span className="reset-marker">move</span>
                {reset.move}
              </li>
            </ol>
            <span className="card-watermark">beehour.app/reset</span>
          </div>

          <div className="result-actions">
            <button className="btn-secondary" onClick={handleGenerate}>
              different reset
            </button>
          </div>
        </>
      )}
    </>
  );
}
