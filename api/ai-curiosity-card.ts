import type { VercelRequest, VercelResponse } from '@vercel/node';

const FALLBACK_QUESTIONS = [
  "If this tool could ask you one question, what would you most dread answering?",
  "What would you lose if this technology disappeared tomorrow?",
  "What does it mean that a machine can now do something you once thought was uniquely human?",
  "What part of yourself have you quietly outsourced without noticing?",
  "If this tool could see what you use it for, what would it learn about you?",
  "What would you have done with this time, ten years ago?",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const { toolName } = req.body || {};
  const trimmed = (toolName || '').trim();

  if (!trimmed) {
    return res.status(400).json({ error: 'toolName is required' });
  }
  if (trimmed.length > 60) {
    return res.status(400).json({ error: 'tool name must be 60 characters or fewer' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return res.status(200).json({ question: fallback });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          { role: 'user', content: trimmed },
        ],
      }),
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

    const data = await response.json();
    const question = data.choices?.[0]?.message?.content?.trim();
    if (!question) throw new Error('empty response');

    return res.status(200).json({ question });
  } catch {
    const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    return res.status(200).json({ question: fallback });
  }
}
