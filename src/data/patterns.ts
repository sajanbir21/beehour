export type PatternKey = 'overloaded' | 'environment' | 'all-or-nothing' | 'unrealistic';

export interface Pattern {
  key: PatternKey;
  name: string;
  tagline: string;
  color: string;
  emoji: string;
  meaning: string;
  whyItHappens: string;
  signs: string[];
  realLifeExample: string;
  smallestFix: string;
  fixDetail: string;
  sevenDayPlan: string[];
  shareOneLiner: string;
  ctaText: string;
}

export const PATTERNS: Record<PatternKey, Pattern> = {
  overloaded: {
    key: 'overloaded',
    name: 'Overloaded Brain',
    tagline: 'Your habit is breaking because your brain is full — not because you are lazy.',
    color: '#FF8906',
    emoji: '🧠',
    meaning: 'Your brain is carrying too much stress, fatigue, or decision load — so the habit gets pushed aside.',
    whyItHappens: 'Stress, poor sleep, and too many decisions drain the mental energy you need to start. When capacity is low, even simple habits feel heavy.',
    signs: [
      'You plan well, then skip when the day gets busy.',
      'Small tasks feel bigger than they should.',
      'You need a lot of mental energy just to begin.',
    ],
    realLifeExample: 'You decide to work out after college, but after a long day and too many notifications, you scroll instead — and tell yourself you\'ll start tomorrow.',
    smallestFix: 'Do the habit for just 2 minutes today.',
    fixDetail: 'Reduce the habit to its absolute minimum. 2-minute version. No pressure to do more. The goal is to show up, not to perform.',
    sevenDayPlan: [
      'Do the 2-minute version. Nothing more.',
      'Repeat it at the same time. Same place.',
      'Remove one decision before you start (lay out your gym clothes, open the book, etc.).',
      'Keep the version small. Resist the urge to do more.',
      'Add one small cue that triggers the habit.',
      'If you miss, do 30 seconds. That counts.',
      'Review: what drained you most this week?',
    ],
    shareOneLiner: 'My habit pattern: Overloaded Brain. The fix? 2 minutes is enough.',
    ctaText: 'Start my 7-day reset',
  },
  environment: {
    key: 'environment',
    name: 'Environment Mismatch',
    tagline: 'Your surroundings are defeating the habit before motivation can help.',
    color: '#3DDC84',
    emoji: '🌍',
    meaning: 'Your physical environment — your phone, room, people, or time of day — is working against the habit.',
    whyItHappens: 'Habits run on cues. When your environment sends the wrong cues, you follow them automatically. It\'s not a willpower problem — it\'s a design problem.',
    signs: [
      'You do the habit fine in some places, but not others.',
      'Certain people or devices consistently break the routine.',
      'You forget to start because there\'s no trigger.',
    ],
    realLifeExample: 'You plan to read before bed, but your phone is on the nightstand. Every single night, you end up scrolling until 1am instead.',
    smallestFix: 'Change one thing in your environment today.',
    fixDetail: 'Move the phone to another room. Put the book on your pillow. Lay out your workout gear the night before. One environmental change can do more than a week of motivation.',
    sevenDayPlan: [
      'Identify the one thing in your environment that triggers failure.',
      'Remove or move it. Do the habit in its absence.',
      'Add a visual cue that reminds you to start (sticky note, item on desk, alarm label).',
      'Do the habit in the same place at the same time.',
      'Test a different location if the current one keeps failing.',
      'Notice when your environment helps. Recreate that setup.',
      'Review: which cue change made the biggest difference?',
    ],
    shareOneLiner: 'My habit pattern: Environment Mismatch. Change the space, change the habit.',
    ctaText: 'Start my 7-day environment fix',
  },
  'all-or-nothing': {
    key: 'all-or-nothing',
    name: 'All-or-Nothing Pattern',
    tagline: 'One missed day is turning into a full stop.',
    color: '#E53170',
    emoji: '🔁',
    meaning: 'You treat one slip like total failure — so a single miss ends the whole streak.',
    whyItHappens: 'Perfectionism and streak pressure make one miss feel catastrophic. The habit gets abandoned not because it stopped working, but because the idea of "perfect" broke.',
    signs: [
      'You skip once and tell yourself you\'ll restart next week.',
      'You lose momentum after one bad day.',
      'You aim for perfect consistency and accept nothing less.',
    ],
    realLifeExample: 'You miss one gym day and then stop going for the entire week because the streak feels broken and starting over feels pointless.',
    smallestFix: 'Use the "never miss twice" rule — starting today.',
    fixDetail: 'One miss is an accident. Two misses is a new habit. Your only rule: after any miss, come back the very next day with a minimum version.',
    sevenDayPlan: [
      'Do one tiny version of the habit today. No pressure for full effort.',
      'Repeat it tomorrow — even if imperfect.',
      'Plan in advance what your "bad day version" looks like.',
      'When you feel like quitting, do the minimum version instead.',
      'Remove the streak counter. Focus on showing up, not numbers.',
      'If you miss, come back the same day or the next. Don\'t wait.',
      'Review: how many days did you show up this week? That\'s your real score.',
    ],
    shareOneLiner: 'My habit pattern: All-or-Nothing. Never miss twice — that\'s the whole rule.',
    ctaText: 'Start my recovery plan',
  },
  unrealistic: {
    key: 'unrealistic',
    name: 'Unrealistic Expectation',
    tagline: 'The goal is too big for where you are right now.',
    color: '#A78BFA',
    emoji: '🎯',
    meaning: 'You\'re trying to build a habit that\'s too large, too fast — without a ramp-up plan.',
    whyItHappens: 'Ambition drives you to set big targets. But without a realistic timeline and a smaller starting version, the gap between goal and reality becomes discouraging.',
    signs: [
      'You plan 1 hour of study but can barely manage 10 minutes.',
      'The habit feels fine in theory but impossible in practice.',
      'You\'ve tried the same goal multiple times and it keeps falling apart.',
    ],
    realLifeExample: 'You commit to running 5km every morning starting Monday. By Wednesday, you\'ve skipped twice because your body wasn\'t ready and the goal felt too far away.',
    smallestFix: 'Shrink the target by 80% — then build from there.',
    fixDetail: 'If you planned to work out 1 hour, start with 12 minutes. If you planned to study 3 chapters, start with half a page. Consistency at a smaller size beats occasional attempts at a large one.',
    sevenDayPlan: [
      'Identify the smallest possible version of this habit.',
      'Do that version today. That\'s the new baseline.',
      'Repeat the small version. Don\'t increase yet.',
      'Track consistency, not effort. Show up counts.',
      'After 4 consistent days, add 10% more if it feels easy.',
      'Stay at that level. No more increases this week.',
      'Review: was the original goal too big? What\'s the right size?',
    ],
    shareOneLiner: 'My habit pattern: Unrealistic Expectation. Shrink it first, scale later.',
    ctaText: 'Start my scaled plan',
  },
};
