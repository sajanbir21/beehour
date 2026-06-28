import { useState } from 'react';
import { reflectiveQuestions } from '../data/reflectiveQuestions';
import { soundPrompts } from '../data/soundPrompts';
import { movementPrompts } from '../data/movementPrompts';

function pick<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter(x => x !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface Reset {
  thought: string;
  sound: string;
  move: string;
}

function getNewReset(prev?: Reset): Reset {
  return {
    thought: pick(reflectiveQuestions, prev?.thought),
    sound:   pick(soundPrompts,        prev?.sound),
    move:    pick(movementPrompts,     prev?.move),
  };
}

export default function Reset() {
  const [reset, setReset] = useState<Reset | null>(null);

  function handleGenerate() {
    setReset(r => getNewReset(r ?? undefined));
  }

  return (
    <>
      <h1 className="page-title">5 minutes</h1>
      <p className="page-subtitle">your reset for right now.</p>

      {!reset ? (
        <button onClick={handleGenerate}>give me a reset</button>
      ) : (
        <>
          <div className="card card--dusk reset-card">
            <ul className="reset-list">
              <li className="reset-item">{reset.thought}</li>
              <li className="reset-item">{reset.sound}</li>
              <li className="reset-item">{reset.move}</li>
            </ul>
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
