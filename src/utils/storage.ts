import type { Goal, Task } from '../types';

const GOALS_KEY = 'beehour:goals';
const TASKS_KEY = 'beehour:tasks';

export function loadGoals(): Goal[] {
  try {
    return JSON.parse(localStorage.getItem(GOALS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function loadTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
