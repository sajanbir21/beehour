import { useState, useRef } from 'react';
import Card from '../components/Card';

const FALLBACK_QUESTIONS = [
  "If this tool could ask you one question, what would you most dread answering?",
  "What would you lose if this technology disappeared tomorrow?",
  "What does it mean that a machine can now do something you once thought was uniquely human?",
  "What part of yourself have you quietly outsourced without noticing?",
  "If this tool could see what you use it for, what would it learn about you?",
  "What would you have done with this time, ten years ago?",
];

export default function Mind() {
  const [toolName, setToolName] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = toolName.trim();

    if (!trimmed) {
      setError('type the name of an AI tool first.');
      return;
    }
    if (trimmed.length > 60) {
      setError('keep it under 60 characters — just the tool name.');
      return;
    }

    setError('');
    setLoading(true);
    setQuestion('');

    try {
      const res = await fetch('/.netlify/functions/mind-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'something went wrong');
      }

      const data = await res.json();
      setQuestion(data.question);
    } catch (err) {
      const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      setQuestion(fallback);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setQuestion('');
    setError('');
    setToolName('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <>
      <h1 className="page-title">mind</h1>
      <p className="page-subtitle">type any AI tool. see what it asks back.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={toolName}
            onChange={e => setToolName(e.target.value)}
            placeholder="e.g. ChatGPT, Midjourney, Claude…"
            maxLength={60}
            aria-label="AI tool name"
            disabled={loading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button type="submit" disabled={loading}>
            ask
          </button>
        </div>
        {error && <p className="error-msg" role="alert">{error}</p>}
      </form>

      {loading && (
        <span className="loading-text" aria-live="polite">thinking…</span>
      )}

      {question && !loading && (
        <div className="result-wrap">
          <Card question={question} watermark="beehour.app/mind" />
          <div className="result-actions">
            <button className="btn-secondary" onClick={handleReset}>
              try another
            </button>
          </div>
        </div>
      )}
    </>
  );
}
