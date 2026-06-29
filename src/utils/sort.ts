import type { Goal, Task } from '../types';

const IMPORTANCE_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 };
const ABCDE_RANK: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function deadlineScore(deadline?: string): number {
  if (!deadline) return 0;
  const today = todayISO();
  if (deadline <= today) return 3;
  const daysAway = (new Date(deadline).getTime() - Date.now()) / 86_400_000;
  if (daysAway <= 3) return 2;
  if (daysAway <= 7) return 1;
  return 0;
}

export function getSortedTasks(tasks: Task[], goals: Goal[]): Task[] {
  const today = todayISO();
  const activeGoalIds = new Set(goals.filter(g => g.status === 'active').map(g => g.id));
  const goalMap = new Map(goals.map(g => [g.id, g]));

  const pending = tasks.filter(t =>
    activeGoalIds.has(t.goalId) && !t.completedDates.includes(today)
  );

  return [...pending].sort((a, b) => {
    const aGoal = goalMap.get(a.goalId);
    const bGoal = goalMap.get(b.goalId);

    if (a.isFrog && !b.isFrog) return -1;
    if (!a.isFrog && b.isFrog) return 1;

    const abcdeDiff = ABCDE_RANK[b.abcde] - ABCDE_RANK[a.abcde];
    if (abcdeDiff !== 0) return abcdeDiff;

    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;

    const deadlineDiff = deadlineScore(b.deadline) - deadlineScore(a.deadline);
    if (deadlineDiff !== 0) return deadlineDiff;

    return IMPORTANCE_RANK[bGoal?.importance ?? 'low'] - IMPORTANCE_RANK[aGoal?.importance ?? 'low'];
  });
}

export function suggestFramework(tasks: Task[], goals: Goal[]): string | null {
  const active = goals.filter(g => g.status === 'active');
  if (active.length >= 4 && tasks.length > 10) return 'warren-buffett';
  const urgentCount = tasks.filter(t => t.urgent).length;
  if (urgentCount > tasks.length * 0.5 && tasks.length > 3) return 'eisenhower';
  if (tasks.length > 5) return 'abcde';
  return null;
}
