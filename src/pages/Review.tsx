import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Goal, Task } from '../types';
import { loadGoals, loadTasks } from '../utils/storage';
import { startOfWeekISO, todayISO } from '../utils/date';

export default function Review() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setGoals(loadGoals());
    setTasks(loadTasks());
  }, []);

  const weekStart = startOfWeekISO();
  const today = todayISO();

  // dates this week
  const weekDates: string[] = [];
  const d = new Date(weekStart);
  while (d.toISOString().slice(0, 10) <= today) {
    weekDates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }

  const totalDone = tasks.reduce((acc, t) =>
    acc + t.completedDates.filter(dt => weekDates.includes(dt)).length, 0);

  const totalPossible = tasks.length * weekDates.length;
  const slipped = Math.max(0, totalPossible - totalDone);

  // per-goal streak: consecutive days (back from today) with ≥1 completed task
  function getStreak(goalId: string): number {
    const goalTasks = tasks.filter(t => t.goalId === goalId);
    let streak = 0;
    const check = new Date();
    while (true) {
      const iso = check.toISOString().slice(0, 10);
      const anyDone = goalTasks.some(t => t.completedDates.includes(iso));
      if (!anyDone) break;
      streak++;
      check.setDate(check.getDate() - 1);
    }
    return streak;
  }

  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <div className="review-page">
      <h1 className="page-heading">Weekly Review</h1>

      <div className="review-summary">
        <div className="review-stat">
          <span className="review-num">{totalDone}</span>
          <span className="review-stat-label">done</span>
        </div>
        <span className="review-dot">·</span>
        <div className="review-stat">
          <span className="review-num review-num--slipped">{slipped}</span>
          <span className="review-stat-label">slipped</span>
        </div>
      </div>

      {activeGoals.length > 0 && (
        <div className="streaks">
          <h2 className="streaks-heading">Streaks</h2>
          <ul className="streak-list">
            {activeGoals.map(g => {
              const streak = getStreak(g.id);
              return (
                <li key={g.id} className="streak-row">
                  <span className="streak-goal">{g.name}</span>
                  <span className="streak-count">{streak} day{streak !== 1 ? 's' : ''}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="review-nudge">
        <p className="review-nudge-text">Still the right 5?</p>
        <Link to="/goals" className="btn-signal">Review your goals →</Link>
      </div>
    </div>
  );
}
