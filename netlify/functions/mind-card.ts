import type { Handler } from '@netlify/functions';

const FALLBACK_QUESTIONS = [
  "If this tool could ask you one question, what would you most dread answering?",
  "What would you lose if this technology disappeared tomorrow?",
  "What does it mean that a machine can now do something you once thought was uniquely human?",
  "What part of yourself have you quietly outsourced without noticing?",
  "If this tool could see what you use it for, what would it learn about you?",
  "What would you have done with this time, ten years ago?",
];

// Rate limiting consideration: for MVP this is open. If abuse becomes an issue,
// add IP-based throttling using a lightweight KV store (e.g. Netlify Blobs or Upstash Redis).

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method not allowed' }) };
  }

  let toolName: string;
  try {
    const body = JSON.parse(event.body || '{}');
    toolName = (body.toolName || '').trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid request body' }) };
  }

  if (!toolName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'toolName is required' }) };
  }

  if (toolName.length > 60) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'tool name must be 60 characters or fewer' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return { statusCode: 200, body: JSON.stringify({ question: fallback }) };
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 120,
        temperature: 0.9,
        messages: [
          {
            role: 'system',
            content:
              'Generate exactly one short, sharp, reflective question connecting the AI tool the user names to something timeless about being human — identity, meaning, work, connection, or creativity. One sentence only. No preamble, no explanation, no quotation marks. Plain, direct, slightly unsettling is good. Do not mention that you are an AI.',
          },
          {
            role: 'user',
            content: toolName,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI error: ${res.status}`);
    }

    const data = await res.json();
    const question = data.choices?.[0]?.message?.content?.trim();

    if (!question) throw new Error('empty response from OpenAI');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    };
  } catch {
    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: fallback }),
    };
  }
};
