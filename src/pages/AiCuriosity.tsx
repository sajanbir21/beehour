import { useState, useRef } from 'react';

const FALLBACK_QUESTIONS = [
  "If this tool could ask you one question, what would you most dread answering?",
  "What would you lose if this technology disappeared tomorrow?",
  "What does it mean that a machine can now do something you once thought was uniquely human?",
  "What part of yourself have you quietly outsourced without noticing?",
  "If this tool could see what you use it for, what would it learn about you?",
  "What would you have done with this time, ten years ago?",
];

const SUGGESTED_TOOLS = [
  'ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Copilot',
  'Perplexity', 'Sora', 'Runway', 'Grok', 'Notion AI',
  'Cursor', 'ElevenLabs', 'Kling', 'Gamma', 'Synthesia',
];

export default function AiCuriosity() {
  const [toolName, setToolName] = useState('');
  const [question, setQuestion] = useState('');
  const [submittedTool, setSubmittedTool] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function selectSuggested(name: string) {
    setToolName(name);
    setError('');
    inputRef.current?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = toolName.trim();

    if (!trimmed) {
      setError('pick a tool or type one above.');
      return;
    }
    if (trimmed.length > 60) {
      setError('keep it under 60 characters — just the tool name.');
      return;
    }

    setError('');
    setLoading(true);
    setQuestion('');
    setSubmittedTool(trimmed);

    try {
      const res = await fetch('/.netlify/functions/ai-curiosity-card', {
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
    } catch {
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
    setSubmittedTool('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <>
      <h1 className="page-title">the ai mirror</h1>
      <p className="page-subtitle">
        name any AI tool. see what it asks back about being human.
      </p>

      {!question && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={toolName}
              onChange={e => { setToolName(e.target.value); setError(''); }}
              placeholder="or type any tool name…"
              maxLength={60}
              aria-label="AI tool name"
              disabled={loading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button type="submit" disabled={loading || !toolName.trim()}>ask</button>
          </div>

          <div className="aic-chips" role="group" aria-label="Popular AI tools">
            {SUGGESTED_TOOLS.map(tool => (
              <button
                key={tool}
                type="button"
                className={`aic-chip ${toolName === tool ? 'aic-chip--selected' : ''}`}
                onClick={() => selectSuggested(tool)}
                disabled={loading}
              >
                {tool}
              </button>
            ))}
          </div>

          {error && <p className="error-msg" role="alert">{error}</p>}
        </form>
      )}

      {loading && (
        <span className="loading-text" aria-live="polite">thinking…</span>
      )}

      {question && !loading && (
        <div className="result-wrap">
          <p className="aic-asked-label">{submittedTool} asked back:</p>
          <div className="card card--dusk">
            <p className="card-question">{question}</p>
            <span className="card-watermark">beehour.app/ai-mirror</span>
          </div>
          <div className="result-actions">
            <button className="btn-secondary" onClick={handleReset}>try another tool</button>
          </div>
        </div>
      )}
    </>
  );
}
