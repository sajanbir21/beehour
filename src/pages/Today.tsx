import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Goal, Task } from '../types';
import { loadGoals, loadTasks, saveTasks } from '../utils/storage';
import { getSortedTasks } from '../utils/sort';
import { todayISO } from '../utils/date';

export default function Today() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [justDone, setJustDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    setGoals(loadGoals());
    setTasks(loadTasks());
  }, []);

  const today = todayISO();
  const sorted = getSortedTasks(tasks, goals);
  const anchor = sorted[0] ?? null;
  const rest = sorted.slice(1);
  const done = tasks.filter(t => t.completedDates.includes(today));
  const goalMap = new Map(goals.map(g => [g.id, g]));

  function complete(taskId: string) {
    const updated = tasks.map(t =>
      t.id === taskId && !t.completedDates.includes(today)
        ? { ...t, completedDates: [...t.completedDates, today] }
        : t
    );
    setTasks(updated);
    saveTasks(updated);
    setJustDone(prev => new Set([...prev, taskId]));
    setTimeout(() => setJustDone(prev => { const s = new Set(prev); s.delete(taskId); return s; }), 600);
  }

  if (goals.filter(g => g.status === 'active').length === 0) {
    return (
      <div className="today-empty">
        <p className="today-empty-text">No active goals yet.</p>
        <Link to="/goals" className="btn-signal">Add your first goal →</Link>
      </div>
    );
  }

  if (!anchor && done.length === 0) {
    return (
      <div className="today-empty">
        <p className="today-empty-text">No tasks yet.</p>
        <Link to="/goals" className="btn-signal">Add tasks to your goals →</Link>
      </div>
    );
  }

  return (
    <div className="today">
      {anchor && (
        <div className="anchor-card">
          <span className="anchor-label">Today's one</span>
          <p className="anchor-task">{anchor.name}</p>
          <span className="anchor-goal">{goalMap.get(anchor.goalId)?.name}</span>
          <button
            className={`anchor-complete-btn${justDone.has(anchor.id) ? ' done-flash' : ''}`}
            onClick={() => complete(anchor.id)}
          >
            {justDone.has(anchor.id) ? '✓ Done' : 'Mark done'}
          </button>
        </div>
      )}

      {rest.length > 0 && (
        <ol className="task-list">
          {rest.map((task, i) => (
            <li key={task.id} className="task-row">
              <span className="task-num">{String(i + 2).padStart(2, '0')}.</span>
              <div className="task-info">
                <span className="task-name">{task.name}</span>
                <span className="task-goal-label">{goalMap.get(task.goalId)?.name}</span>
              </div>
              <button
                className={`task-complete-btn${justDone.has(task.id) ? ' done-flash' : ''}`}
                onClick={() => complete(task.id)}
                aria-label={`Complete ${task.name}`}
              >
                {justDone.has(task.id) ? '✓' : <span className="task-circle" />}
              </button>
            </li>
          ))}
        </ol>
      )}

      {done.length > 0 && (
        <div className="done-section">
          <span className="done-label">Done today</span>
          <ul className="done-list">
            {done.map(t => (
              <li key={t.id} className="done-row">
                <span className="done-check">✓</span>
                <span className="done-name">{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
