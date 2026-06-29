import { useState, useEffect } from 'react';
import type { Goal, Task, GoalType, Importance } from '../types';
import { loadGoals, saveGoals, loadTasks, saveTasks } from '../utils/storage';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const MAX_ACTIVE = 5;

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [overflowGoal, setOverflowGoal] = useState<Omit<Goal, 'id' | 'createdAt' | 'status'> | null>(null);
  const [newTask, setNewTask] = useState<Record<string, string>>({});

  // form state
  const [name, setName] = useState('');
  const [type, setType] = useState<GoalType>('personal');
  const [importance, setImportance] = useState<Importance>('medium');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    setGoals(loadGoals());
    setTasks(loadTasks());
  }, []);

  const active = goals.filter(g => g.status === 'active');
  const shelved = goals.filter(g => g.status === 'shelved');

  function submitGoal(status: 'active' | 'shelved' = 'active') {
    const goal: Goal = {
      id: uid(),
      name,
      type,
      importance,
      deadline: deadline || undefined,
      status,
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    saveGoals(updated);
    resetForm();
  }

  function handleAddGoal() {
    if (!name.trim()) return;
    if (active.length >= MAX_ACTIVE) {
      setOverflowGoal({ name, type, importance, deadline: deadline || undefined });
      setShowForm(false);
      return;
    }
    submitGoal('active');
  }

  function resolveOverflow(action: 'wait' | 'shelve', shelveId?: string) {
    if (!overflowGoal) return;
    if (action === 'wait') {
      submitGoalDirect({ ...overflowGoal, status: 'shelved' });
    } else if (action === 'shelve' && shelveId) {
      const updated = goals.map(g => g.id === shelveId ? { ...g, status: 'shelved' as const } : g);
      const newGoal: Goal = {
        id: uid(),
        ...overflowGoal,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      const final = [...updated, newGoal];
      setGoals(final);
      saveGoals(final);
    }
    setOverflowGoal(null);
    resetForm();
  }

  function submitGoalDirect(g: Omit<Goal, 'id' | 'createdAt'>) {
    const goal: Goal = { id: uid(), ...g, createdAt: new Date().toISOString() };
    const updated = [...goals, goal];
    setGoals(updated);
    saveGoals(updated);
  }

  function resetForm() {
    setName(''); setType('personal'); setImportance('medium'); setDeadline('');
    setShowForm(false);
  }

  function shelveGoal(id: string) {
    const updated = goals.map(g => g.id === id ? { ...g, status: 'shelved' as const } : g);
    setGoals(updated); saveGoals(updated);
  }

  function activateGoal(id: string) {
    if (active.length >= MAX_ACTIVE) return;
    const updated = goals.map(g => g.id === id ? { ...g, status: 'active' as const } : g);
    setGoals(updated); saveGoals(updated);
  }

  function addTask(goalId: string) {
    const name = (newTask[goalId] || '').trim();
    if (!name) return;
    const task: Task = { id: uid(), goalId, name, completedDates: [] };
    const updated = [...tasks, task];
    setTasks(updated); saveTasks(updated);
    setNewTask(prev => ({ ...prev, [goalId]: '' }));
  }

  function deleteTask(taskId: string) {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated); saveTasks(updated);
  }

  return (
    <div className="goals-page">
      <div className="goals-header">
        <h1 className="page-heading">Goals <span className="goals-count">{active.length}/{MAX_ACTIVE}</span></h1>
        {!showForm && !overflowGoal && (
          <button className="btn-signal" onClick={() => setShowForm(true)}>+ Add goal</button>
        )}
      </div>

      {showForm && (
        <div className="goal-form">
          <input
            className="form-input"
            placeholder="Goal name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <div className="form-row">
            <select className="form-select" value={type} onChange={e => setType(e.target.value as GoalType)}>
              <option value="fitness">Fitness</option>
              <option value="career">Career</option>
              <option value="personal">Personal</option>
              <option value="mixed">Mixed</option>
            </select>
            <div className="importance-group">
              {(['high', 'medium', 'low'] as Importance[]).map(i => (
                <button
                  key={i}
                  className={`importance-btn${importance === i ? ' importance-btn--active' : ''}`}
                  onClick={() => setImportance(i)}
                >{i}</button>
              ))}
            </div>
          </div>
          <input
            className="form-input"
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            placeholder="Deadline (optional)"
          />
          <div className="form-actions">
            <button className="btn-signal" onClick={handleAddGoal} disabled={!name.trim()}>Save goal</button>
            <button className="btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {overflowGoal && (
        <div className="overflow-prompt">
          <p className="overflow-text">You've got 5 active. Want to swap one out, or let this one wait?</p>
          <div className="overflow-actions">
            <button className="btn-ghost" onClick={() => resolveOverflow('wait')}>Add to waiting list</button>
          </div>
          <ul className="overflow-swap-list">
            {active.map(g => (
              <li key={g.id}>
                <button className="overflow-swap-btn" onClick={() => resolveOverflow('shelve', g.id)}>
                  Shelve "{g.name}" → add "{overflowGoal.name}"
                </button>
              </li>
            ))}
          </ul>
          <button className="btn-ghost" onClick={() => { setOverflowGoal(null); resetForm(); }}>Cancel</button>
        </div>
      )}

      {active.length === 0 && !showForm && (
        <p className="goals-empty">No active goals. Add your first one.</p>
      )}

      <ul className="goal-list">
        {active.map(goal => {
          const goalTasks = tasks.filter(t => t.goalId === goal.id);
          return (
            <li key={goal.id} className="goal-card">
              <div className="goal-card-header">
                <div className="goal-card-meta">
                  <span className="goal-name">{goal.name}</span>
                  <div className="goal-tags">
                    <span className="goal-type">{goal.type}</span>
                    <span className={`goal-importance goal-importance--${goal.importance}`}>{goal.importance}</span>
                    {goal.deadline && <span className="goal-deadline">{goal.deadline}</span>}
                  </div>
                </div>
                <button className="btn-ghost btn-sm" onClick={() => shelveGoal(goal.id)}>Shelve</button>
              </div>

              <ul className="task-items">
                {goalTasks.map(t => (
                  <li key={t.id} className="task-item">
                    <span>{t.name}</span>
                    <button className="task-delete" onClick={() => deleteTask(t.id)} aria-label="Delete task">×</button>
                  </li>
                ))}
              </ul>

              <div className="task-add-row">
                <input
                  className="form-input form-input--sm"
                  placeholder="Add a task..."
                  value={newTask[goal.id] || ''}
                  onChange={e => setNewTask(prev => ({ ...prev, [goal.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addTask(goal.id)}
                />
                <button className="btn-ghost btn-sm" onClick={() => addTask(goal.id)}>Add</button>
              </div>
            </li>
          );
        })}
      </ul>

      {shelved.length > 0 && (
        <div className="shelved-section">
          <h2 className="shelved-heading">Waiting / Shelved</h2>
          <ul className="shelved-list">
            {shelved.map(g => (
              <li key={g.id} className="shelved-row">
                <span className="shelved-name">{g.name}</span>
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => activateGoal(g.id)}
                  disabled={active.length >= MAX_ACTIVE}
                >
                  {active.length >= MAX_ACTIVE ? 'Full' : 'Activate'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
