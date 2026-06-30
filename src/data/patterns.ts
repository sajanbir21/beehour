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
  getSmallestFix: (habit: string) => string;
  getFixDetail: (habit: string) => string;
  getSevenDayPlan: (habit: string) => string[];
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
    realLifeExample: 'You plan to go to the gym after college. But after a long day, you tell yourself you\'re too tired — and scroll until midnight instead. The gym wasn\'t the problem. Your mental tank was already empty.',
    getSmallestFix: (habit) =>
      `Do the absolute minimum version of ${habit} — something so small it takes less than 2 minutes to start.`,
    getFixDetail: (habit) =>
      `The 2-minute rule isn't about doing ${habit} for 2 minutes. It's about removing the mental barrier to starting. If the habit is going to the gym — just put on your shoes and walk out the door. That's it. Once you start, you'll often continue. If you don't, you still showed up.`,
    getSevenDayPlan: (habit) => [
      `Do the smallest possible version of ${habit} today. Don't aim for full effort.`,
      `Repeat it at the same time. Before you start, remove one decision (lay out clothes, open the app, set the book on your desk).`,
      `Keep the version small. Resist the urge to do more even if you feel good.`,
      `Notice when your energy is highest. Try doing ${habit} at that time instead.`,
      `Add one small cue that automatically triggers ${habit} — an alarm label, an object in sight, a location.`,
      `If you miss, do 30 seconds of ${habit}. Anything. That counts as showing up.`,
      `Review: what drained you most this week? What one thing could you remove to protect your habit energy?`,
    ],
    shareOneLiner: 'My habit pattern: Overloaded Brain. The fix? Start smaller than you think.',
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
    realLifeExample: 'You plan to read before bed, but your phone is on the nightstand. Every single night, you end up scrolling until 1am instead. The reading habit isn\'t failing — your environment is making the wrong thing easier.',
    getSmallestFix: (habit) =>
      `Change one thing in your environment that makes ${habit} easier to start.`,
    getFixDetail: (habit) =>
      `For ${habit}, identify what triggers you to skip it — a device, a location, a person, a time of day. Then either remove that trigger or add a cue that pulls you toward the habit instead. Put the thing you need for ${habit} in plain sight. Make the right choice the path of least resistance.`,
    getSevenDayPlan: (habit) => [
      `Identify the one environmental trigger that most often causes you to skip ${habit}.`,
      `Remove or move that trigger. Do ${habit} without it today.`,
      `Add a visual cue — something you'll see that reminds you to start ${habit}.`,
      `Do ${habit} in the same place at the same time. Consistency builds automatic cues.`,
      `If the current location keeps failing, test a different one this week.`,
      `Notice which setup made ${habit} easiest. Recreate it intentionally.`,
      `Review: which one environmental change made the biggest difference this week?`,
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
    realLifeExample: 'You miss one gym day and then stop going for the entire week because the streak feels broken and starting over feels pointless. The habit didn\'t fail — the rule "all or nothing" did.',
    getSmallestFix: (habit) =>
      `Use the "never miss twice" rule for ${habit} starting today.`,
    getFixDetail: (habit) =>
      `One miss of ${habit} is an accident. Two misses is a new habit forming — in the wrong direction. Your only rule: after any miss, come back the very next day with a minimum version. It doesn't need to be good. It just needs to happen. A 20% effort day of ${habit} beats a zero every time.`,
    getSevenDayPlan: (habit) => [
      `Do one tiny version of ${habit} today — no pressure for full effort.`,
      `Repeat tomorrow, even if it feels imperfect or incomplete.`,
      `Write down in advance what your "bad day version" of ${habit} looks like.`,
      `When you feel like quitting, do the minimum version instead of nothing.`,
      `Remove the streak counter if you have one. Focus on showing up, not numbers.`,
      `If you miss ${habit}, come back the same day or the very next. Don't wait for Monday.`,
      `Review: how many days did you show up this week? That number — not perfection — is your real score.`,
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
      'You plan 1 hour but can barely manage 10 minutes.',
      'The habit feels fine in theory but impossible in practice.',
      'You\'ve tried the same goal multiple times and it keeps falling apart at the same point.',
    ],
    realLifeExample: 'You commit to running 5km every morning starting Monday. By Wednesday, you\'ve skipped twice because your body wasn\'t ready and the goal felt too far away. The problem wasn\'t motivation — it was the size of the target.',
    getSmallestFix: (habit) =>
      `Shrink ${habit} by 80% — then build from there.`,
    getFixDetail: (habit) =>
      `If your current version of ${habit} feels hard to start, it's too big. Reduce it until it feels almost embarrassingly easy. If you planned an hour, start with 10 minutes. If you planned 10 minutes, start with 2. Consistency at a smaller size builds the neural pattern. You can scale up once showing up becomes automatic.`,
    getSevenDayPlan: (habit) => [
      `Identify the smallest possible version of ${habit} — something you could do even on your worst day.`,
      `Do that version today. That's your new baseline, not a compromise.`,
      `Repeat the small version tomorrow. Don't increase yet. Let it feel easy.`,
      `Track that you showed up, not how long or how well you did ${habit}.`,
      `After 4 consistent days, add 10% more if it genuinely feels easy — not before.`,
      `Stay at that level. No more increases this week. Stability first.`,
      `Review: was your original goal too big? What's the version of ${habit} you can sustain for 3 months?`,
    ],
    shareOneLiner: 'My habit pattern: Unrealistic Expectation. Shrink it first, scale later.',
    ctaText: 'Start my scaled plan',
  },
};
