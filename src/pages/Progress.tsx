import { useState, useEffect } from 'react';
import type { Goal, Task, Habit } from '../types';
import { loadGoals, loadTasks, loadHabits } from '../utils/storage';
import { getLast7Days, formatDayLetter, getStreak, todayISO } from '../utils/date';

export default function Progress() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => { setGoals(loadGoals()); setTasks(loadTasks()); setHabits(loadHabits()); }, []);

  const week = getLast7Days();
  const today = todayISO();
  const activeGoals = goals.filter(g => g.status === 'active');

  const totalDoneThisWeek = tasks.reduce((acc, t) => acc + t.completedDates.filter(d => week.includes(d)).length, 0);
  const totalHabitDoneThisWeek = habits.reduce((acc, h) => acc + h.completedDates.filter(d => week.includes(d)).length, 0);
  const todayTasks = tasks.filter(t => t.completedDates.includes(today) && goals.find(g => g.id === t.goalId && g.status === 'active'));

  function taskStreakForGoal(goalId: string): number {
    const goalTasks = tasks.filter(t => t.goalId === goalId);
    if (goalTasks.length === 0) return 0;
    const allDates = new Set(goalTasks.flatMap(t => t.completedDates));
    return getStreak([...allDates]);
  }

  return (
    <div className="progress-page">
      <h1 className="page-heading">Progress</h1>

      <div className="progress-summary">
        <div className="progress-stat">
          <span className="progress-num">{todayTasks.length}</span>
          <span className="progress-label">done today</span>
        </div>
        <div className="progress-stat">
          <span className="progress-num">{totalDoneThisWeek}</span>
          <span className="progress-label">tasks this week</span>
        </div>
        <div className="progress-stat">
          <span className="progress-num">{totalHabitDoneThisWeek}</span>
          <span className="progress-label">habits this week</span>
        </div>
      </div>

      <div className="week-heatmap">
        <h2 className="section-heading">This week</h2>
        <div className="week-cols">
          {week.map(d => {
            const taskCount = tasks.reduce((acc, t) => acc + (t.completedDates.includes(d) ? 1 : 0), 0);
            const habitCount = habits.reduce((acc, h) => acc + (h.completedDates.includes(d) ? 1 : 0), 0);
            const total = taskCount + habitCount;
            const intensity = total === 0 ? 0 : total <= 2 ? 1 : total <= 4 ? 2 : 3;
            return (
              <div key={d} className="week-col">
                <div className={`week-bar week-bar--${intensity}`} />
                <span className="week-day-label">{formatDayLetter(d)}</span>
                <span className="week-day-count">{total > 0 ? total : ''}</span>
              </div>
            );
          })}
        </div>
      </div>

      {activeGoals.length > 0 && (
        <div className="goal-streaks">
          <h2 className="section-heading">Goal streaks</h2>
          <ul className="streak-list">
            {activeGoals.map(g => {
              const streak = taskStreakForGoal(g.id);
              const weekDone = week.filter(d => tasks.some(t => t.goalId === g.id && t.completedDates.includes(d))).length;
              return (
                <li key={g.id} className="streak-row">
                  <div className="streak-info">
                    <span className="streak-goal">{g.name}</span>
                    <span className={`goal-importance goal-importance--${g.importance}`}>{g.importance}</span>
                  </div>
                  <div className="streak-right">
                    <div className="streak-dots">
                      {week.map(d => (
                        <span key={d} className={`streak-dot${tasks.some(t => t.goalId === g.id && t.completedDates.includes(d)) ? ' streak-dot--done' : ''}`} />
                      ))}
                    </div>
                    <span className="streak-count">{streak > 0 ? `🔥 ${streak}d` : `${weekDone}/7`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {habits.length > 0 && (
        <div className="habit-streaks">
          <h2 className="section-heading">Habit streaks</h2>
          <ul className="streak-list">
            {habits.map(h => {
              const streak = getStreak(h.completedDates);
              return (
                <li key={h.id} className="streak-row">
                  <div className="streak-info">
                    <span className="streak-goal">{h.name}</span>
                    <span className="goal-type">{h.frequency}</span>
                  </div>
                  <div className="streak-right">
                    <div className="streak-dots">
                      {week.map(d => (
                        <span key={d} className={`streak-dot${h.completedDates.includes(d) ? ' streak-dot--done' : ''}`} />
                      ))}
                    </div>
                    <span className="streak-count">{streak > 0 ? `🔥 ${streak}d` : '—'}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
