import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Goal, Task, Habit } from '../types';
import { loadGoals, loadTasks, loadHabits } from '../utils/storage';
import { startOfWeekISO, todayISO, getStreak } from '../utils/date';

export default function Review() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => { setGoals(loadGoals()); setTasks(loadTasks()); setHabits(loadHabits()); }, []);

  const weekStart = startOfWeekISO();
  const today = todayISO();
  const weekDates: string[] = [];
  const d = new Date(weekStart);
  while (d.toISOString().slice(0, 10) <= today) {
    weekDates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }

  const tasksDone = tasks.reduce((acc, t) => acc + t.completedDates.filter(dt => weekDates.includes(dt)).length, 0);
  const tasksSlipped = tasks.filter(t => goals.find(g => g.id === t.goalId && g.status === 'active') && !t.completedDates.some(dt => weekDates.includes(dt))).length;
  const habitsDone = habits.reduce((acc, h) => acc + h.completedDates.filter(dt => weekDates.includes(dt)).length, 0);
  const activeGoals = goals.filter(g => g.status === 'active');

  function goalStreak(goalId: string) {
    const goalTasks = tasks.filter(t => t.goalId === goalId);
    const allDates = new Set(goalTasks.flatMap(t => t.completedDates));
    return getStreak([...allDates]);
  }

  return (
    <div className="review-page">
      <h1 className="page-heading">Weekly Review</h1>

      <div className="review-summary">
        <div className="review-stat">
          <span className="review-num">{tasksDone}</span>
          <span className="review-stat-label">tasks done</span>
        </div>
        <span className="review-dot">·</span>
        <div className="review-stat">
          <span className="review-num review-num--slipped">{tasksSlipped}</span>
          <span className="review-stat-label">slipped</span>
        </div>
        <span className="review-dot">·</span>
        <div className="review-stat">
          <span className="review-num" style={{ color: 'var(--confirm)' }}>{habitsDone}</span>
          <span className="review-stat-label">habits</span>
        </div>
      </div>

      {activeGoals.length > 0 && (
        <div className="streaks">
          <h2 className="streaks-heading">Goal streaks</h2>
          <ul className="streak-list">
            {activeGoals.map(g => {
              const streak = goalStreak(g.id);
              return (
                <li key={g.id} className="streak-row">
                  <div className="streak-info">
                    <span className="streak-goal">{g.name}</span>
                    <span className={`goal-importance goal-importance--${g.importance}`}>{g.importance}</span>
                  </div>
                  <span className="streak-count">{streak > 0 ? `🔥 ${streak} day${streak !== 1 ? 's' : ''}` : '—'}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="review-nudge">
        <p className="review-nudge-text">Still the right 5 goals?</p>
        <Link to="/goals" className="btn-signal">Review your goals →</Link>
      </div>
    </div>
  );
}
