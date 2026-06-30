export interface Question {
  id: number;
  text: string;
  type: 'pattern' | 'readiness';
  scale: '0-4' | '0-10';
}

export const QUESTIONS: Question[] = [
  { id: 1,  text: 'I start strong, but my habit fades after 1–3 days.',                                type: 'pattern',   scale: '0-4' },
  { id: 2,  text: 'The habit feels too big for my current routine.',                                   type: 'pattern',   scale: '0-4' },
  { id: 3,  text: 'I usually fail when my day becomes busy or stressful.',                             type: 'pattern',   scale: '0-4' },
  { id: 4,  text: 'My habit is strongly affected by where I am or who is around me.',                  type: 'pattern',   scale: '0-4' },
  { id: 5,  text: 'I feel mentally tired before starting the habit.',                                  type: 'pattern',   scale: '0-4' },
  { id: 6,  text: 'I delay because the habit feels uncomfortable, boring, or difficult.',              type: 'pattern',   scale: '0-4' },
  { id: 7,  text: 'I overthink doing the habit perfectly before starting.',                            type: 'pattern',   scale: '0-4' },
  { id: 8,  text: 'If I miss one day, I usually lose momentum completely.',                            type: 'pattern',   scale: '0-4' },
  { id: 9,  text: 'How important is it for you to fix this habit right now?',                          type: 'readiness', scale: '0-10' },
  { id: 10, text: 'How confident are you that you can improve this habit?',                            type: 'readiness', scale: '0-10' },
];

export const SCALE_LABELS_4 = ['Not true', 'A little true', 'Somewhat true', 'Very true', 'Extremely true'];
export const SCALE_LABELS_10_LOW  = 'Not at all';
export const SCALE_LABELS_10_HIGH = 'Completely';
