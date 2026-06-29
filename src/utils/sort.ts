import type { Goal, Task } from '../types';

const IMPORTANCE_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function deadlineScore(deadline?: string): number {
  if (!deadline) return 0;
  const today = todayISO();
  if (deadline <= today) return 3; // overdue or due today
  const daysAway = (new Date(deadline).getTime() - Date.now()) / 86_400_000;
  if (daysAway <= 3) return 2;
  if (daysAway <= 7) return 1;
  return 0;
}

export function getSortedTasks(tasks: Task[], goals: Goal[]): Task[] {
  const today = todayISO();
  const activeGoalIds = new Set(goals.filter(g => g.status === 'active').map(g => g.id));
  const goalMap = new Map(goals.map(g => [g.id, g]));

  const pending = tasks.filter(t => {
    if (!activeGoalIds.has(t.goalId)) return false;
    return !t.completedDates.includes(today);
  });

  return [...pending].sort((a, b) => {
    const aGoal = goalMap.get(a.goalId);
    const bGoal = goalMap.get(b.goalId);
    const aScore = deadlineScore(a.deadline) * 10 + IMPORTANCE_RANK[aGoal?.importance ?? 'low'];
    const bScore = deadlineScore(b.deadline) * 10 + IMPORTANCE_RANK[bGoal?.importance ?? 'low'];
    return bScore - aScore;
  });
}
