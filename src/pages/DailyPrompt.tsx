import { useState } from 'react';
import { dailyPrompts } from '../data/dailyPrompts';
import OtherTools from '../components/OtherTools';

function getRandomPrompt(exclude: string): string {
  const pool = dailyPrompts.filter(p => p !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function DailyPrompt() {
  const [prompt, setPrompt] = useState<string>(
    dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)]
  );

  function handleAnother() {
    setPrompt(getRandomPrompt(prompt));
  }

  return (
    <>
      <h1 className="page-title">Your Question for Today</h1>
      <p className="page-subtitle">Written by hand, not by AI.</p>

      <div className="daily-prompt-card">
        <p className="daily-prompt-question">{prompt}</p>
        <p className="daily-prompt-hint">Sit with it. You don't have to answer it anywhere.</p>
      </div>

      <button className="btn-secondary daily-prompt-another" onClick={handleAnother}>
        different one
      </button>

      <OtherTools />
    </>
  );
}
