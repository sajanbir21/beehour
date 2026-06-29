import type { Goal, Task, Habit } from '../types';

const GOALS_KEY     = 'beehour:goals';
const TASKS_KEY     = 'beehour:tasks';
const HABITS_KEY    = 'beehour:habits';
const ONBOARDED_KEY = 'beehour:onboarded';

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const loadGoals   = () => load<Goal>(GOALS_KEY);
export const saveGoals   = (d: Goal[])  => save(GOALS_KEY, d);
export const loadTasks   = () => load<Task>(TASKS_KEY);
export const saveTasks   = (d: Task[])  => save(TASKS_KEY, d);
export const loadHabits  = () => load<Habit>(HABITS_KEY);
export const saveHabits  = (d: Habit[]) => save(HABITS_KEY, d);
export const isOnboarded  = () => localStorage.getItem(ONBOARDED_KEY) === '1';
export const setOnboarded = () => localStorage.setItem(ONBOARDED_KEY, '1');
