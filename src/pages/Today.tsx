import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Goal, Task } from '../types';
import { loadGoals, loadTasks, saveTasks } from '../utils/storage';
import { getSortedTasks, suggestFramework } from '../utils/sort';
import { todayISO } from '../utils/date';

const FRAMEWORK_TIPS: Record<string, { title: string; desc: string }> = {
  'warren-buffett': {
    title: 'Warren Buffett 5/25',
    desc: 'You have many goals and tasks. Consider shelving goals beyond your top 5 — everything else is a distraction.',
  },
  eisenhower: {
    title: 'Eisenhower Matrix',
    desc: 'Many tasks are urgent. Sort by importance too — urgent + important: do first. Urgent + unimportant: delegate.',
  },
  abcde: {
    title: 'ABCDE Method',
    desc: 'With this many tasks, rank each A–E. A = must do today. E = eliminate entirely.',
  },
};

const ABCDE_COLORS: Record<string, string> = {
  A: 'var(--signal)', B: '#F5A623', C: 'var(--text-muted)', D: '#555', E: '#444',
};

export default function Today() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [justDone, setJustDone] = useState<Set<string>>(new Set());
  const [dismissedTip, setDismissedTip] = useState(false);

  useEffect(() => {
    setGoals(loadGoals());
    setTasks(loadTasks());
  }, []);

  const today = todayISO();
  const sorted = getSortedTasks(tasks, goals);
  const frog = sorted.find(t => t.isFrog) ?? sorted[0] ?? null;
  const rest = sorted.filter(t => t.id !== frog?.id);
  const done = tasks.filter(t =>
    t.completedDates.includes(today) &&
    goals.find(g => g.id === t.goalId && g.status === 'active')
  );
  const goalMap = new Map(goals.map(g => [g.id, g]));
  const tip = !dismissedTip ? suggestFramework(tasks, goals) : null;

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
        <Link to="/goals" className="btn-signal">Set up your goals →</Link>
      </div>
    );
  }

  if (!frog && done.length === 0) {
    return (
      <div className="today-empty">
        <p className="today-empty-text">No tasks for today.</p>
        <Link to="/goals" className="btn-signal">Add tasks to your goals →</Link>
      </div>
    );
  }

  return (
    <div className="today">
      {tip && FRAMEWORK_TIPS[tip] && (
        <div className="framework-tip">
          <div className="framework-tip-content">
            <span className="framework-tip-title">{FRAMEWORK_TIPS[tip].title}</span>
            <p className="framework-tip-desc">{FRAMEWORK_TIPS[tip].desc}</p>
          </div>
          <button className="framework-tip-dismiss" onClick={() => setDismissedTip(true)}>×</button>
        </div>
      )}

      {frog && (
        <div className="frog-card">
          <span className="frog-label">🐸 Eat That Frog — do this first</span>
          <p className="frog-task">{frog.name}</p>
          <span className="frog-goal">{goalMap.get(frog.goalId)?.name}</span>
          <div className="frog-meta">
            <span className="abcde-badge" style={{ color: ABCDE_COLORS[frog.abcde] }}>{frog.abcde}</span>
            {frog.urgent && <span className="urgent-badge">Urgent</span>}
            {frog.timeBlock && <span className="timeblock-badge">⏰ {frog.timeBlock}</span>}
          </div>
          <button
            className={`anchor-complete-btn${justDone.has(frog.id) ? ' done-flash' : ''}`}
            onClick={() => complete(frog.id)}
          >
            {justDone.has(frog.id) ? '✓ Done' : 'Mark done'}
          </button>
        </div>
      )}

      {rest.length > 0 && (
        <ol className="task-list">
          {rest.map((task, i) => (
            <li key={task.id} className="task-row">
              <span className="task-num">{String(i + (frog ? 2 : 1)).padStart(2, '0')}.</span>
              <div className="task-info">
                <span className="task-name">{task.name}</span>
                <div className="task-meta-row">
                  <span className="task-goal-label">{goalMap.get(task.goalId)?.name}</span>
                  <span className="abcde-badge abcde-badge--sm" style={{ color: ABCDE_COLORS[task.abcde] }}>{task.abcde}</span>
                  {task.urgent && <span className="urgent-badge urgent-badge--sm">urgent</span>}
                  {task.timeBlock && <span className="timeblock-badge timeblock-badge--sm">⏰ {task.timeBlock}</span>}
                </div>
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
          <span className="done-label">Done today — {done.length}</span>
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
