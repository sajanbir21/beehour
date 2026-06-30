import type { PatternKey } from '../data/patterns';

export interface Answers {
  [key: number]: number;
}

export interface ScoreResult {
  primary: PatternKey;
  secondary: PatternKey | null;
  isBlended: boolean;
  importance: number;
  confidence: number;
  readinessLevel: 'low' | 'medium' | 'high';
  confidenceLabel: string;
  scores: Record<PatternKey, number>;
}

const MATRIX: Record<number, Partial<Record<PatternKey, number>>> = {
  1: { overloaded: 1, 'all-or-nothing': 1, unrealistic: 1 },
  2: { unrealistic: 4 },
  3: { overloaded: 4, unrealistic: 1 },
  4: { environment: 4 },
  5: { overloaded: 4 },
  6: { overloaded: 2, 'all-or-nothing': 1 },
  7: { 'all-or-nothing': 4, unrealistic: 1 },
  8: { 'all-or-nothing': 4 },
};

export function computeScores(answers: Answers): ScoreResult {
  const scores: Record<PatternKey, number> = {
    overloaded: 0,
    environment: 0,
    'all-or-nothing': 0,
    unrealistic: 0,
  };

  // Base scoring
  for (let q = 1; q <= 8; q++) {
    const val = answers[q] ?? 0;
    const row = MATRIX[q] ?? {};
    for (const [pattern, weight] of Object.entries(row)) {
      scores[pattern as PatternKey] += val * weight!;
    }
  }

  const q3 = answers[3] ?? 0;
  const q4 = answers[4] ?? 0;
  const q5 = answers[5] ?? 0;
  const q8 = answers[8] ?? 0;
  const q9 = answers[9] ?? 5;
  const q10 = answers[10] ?? 5;

  // Override rules
  if (q10 >= 7 && q8 <= 2) scores['all-or-nothing'] = Math.max(0, scores['all-or-nothing'] - 2);
  if (q4 >= 3 && q3 <= 2) scores['environment'] += 2;
  if (q3 >= 3 && q5 >= 3) scores['overloaded'] += 2;

  // Sort patterns
  const sorted = (Object.entries(scores) as [PatternKey, number][])
    .sort((a, b) => b[1] - a[1]);

  const primary = sorted[0][0];
  const secondScore = sorted[1][1];
  const primaryScore = sorted[0][1];
  const diff = primaryScore - secondScore;

  let secondary: PatternKey | null = sorted[1][0];
  let isBlended = false;

  if (diff <= 1) { isBlended = true; }
  else if (diff >= 4) { secondary = null; }

  // Readiness
  const importance = q9;
  const confidence = q10;
  const readinessAvg = (importance + confidence) / 2;
  const readinessLevel: 'low' | 'medium' | 'high' =
    readinessAvg <= 3 ? 'low' : readinessAvg <= 6 ? 'medium' : 'high';

  const confidenceLabel =
    confidence <= 3 ? 'needs a smaller start' :
    confidence <= 6 ? 'can improve with structure' :
    'ready to act';

  return { primary, secondary, isBlended, importance, confidence, readinessLevel, confidenceLabel, scores };
}
