import { useState } from 'react';
import Card from '../components/Card';
import { dailyPrompts } from '../data/dailyPrompts';

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
      <h1 className="page-title">daily prompt</h1>
      <p className="page-subtitle">one thought. however long you need it.</p>

      <div style={{ marginBottom: '20px' }}>
        <Card question={prompt} watermark="beehour.app/daily-prompt" />
      </div>

      <button className="btn-secondary" onClick={handleAnother}>
        another
      </button>
    </>
  );
}
