import { useState } from 'react';
import Card from '../components/Card';
import { soulPrompts } from '../data/soulPrompts';

function getRandomPrompt(exclude: string): string {
  const pool = soulPrompts.filter(p => p !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Soul() {
  const [prompt, setPrompt] = useState<string>(
    soulPrompts[Math.floor(Math.random() * soulPrompts.length)]
  );

  function handleAnother() {
    setPrompt(getRandomPrompt(prompt));
  }

  return (
    <>
      <h1 className="page-title">soul</h1>
      <p className="page-subtitle">one thought. however long you need it.</p>

      <div style={{ marginBottom: '20px' }}>
        <Card question={prompt} watermark="beehour.app/soul" />
      </div>

      <button className="btn-secondary" onClick={handleAnother}>
        another
      </button>
    </>
  );
}
