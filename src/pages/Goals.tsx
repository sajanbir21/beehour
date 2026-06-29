import { useState, useEffect } from 'react';
import type { Goal, Task, GoalType, Importance, ABCDERank } from '../types';
import { loadGoals, saveGoals, loadTasks, saveTasks } from '../utils/storage';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const MAX_ACTIVE = 5;

const ABCDE_DESC: Record<ABCDERank, string> = {
  A: 'Must do — serious consequence if skipped',
  B: 'Should do — mild consequence',
  C: 'Nice to do — no consequence',
  D: 'Delegate',
  E: 'Eliminate',
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [overflowGoal, setOverflowGoal] = useState<Omit<Goal, 'id' | 'createdAt' | 'status'> | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, { name: string; abcde: ABCDERank; urgent: boolean; isFrog: boolean; timeBlock: string }>>({});
  const [name, setName] = useState('');
  const [type, setType] = useState<GoalType>('personal');
  const [importance, setImportance] = useState<Importance>('high');
  const [deadline, setDeadline] = useState('');

  useEffect(() => { setGoals(loadGoals()); setTasks(loadTasks()); }, []);

  const active = goals.filter(g => g.status === 'active');
  const shelved = goals.filter(g => g.status === 'shelved');

  function handleAddGoal() {
    if (!name.trim()) return;
    if (active.length >= MAX_ACTIVE) {
      setOverflowGoal({ name, type, importance, deadline: deadline || undefined });
      setShowForm(false);
      return;
    }
    const g: Goal = { id: uid(), name, type, importance, deadline: deadline || undefined, status: 'active', createdAt: new Date().toISOString() };
    const updated = [...goals, g]; setGoals(updated); saveGoals(updated); resetForm();
  }

  function resolveOverflow(action: 'wait' | 'swap', swapId?: string) {
    if (!overflowGoal) return;
    if (action === 'wait') {
      const g: Goal = { id: uid(), ...overflowGoal, status: 'shelved', createdAt: new Date().toISOString() };
      const updated = [...goals, g]; setGoals(updated); saveGoals(updated);
    } else if (swapId) {
      const swapped = goals.map(g => g.id === swapId ? { ...g, status: 'shelved' as const } : g);
      const g: Goal = { id: uid(), ...overflowGoal, status: 'active', createdAt: new Date().toISOString() };
      const updated = [...swapped, g]; setGoals(updated); saveGoals(updated);
    }
    setOverflowGoal(null); resetForm();
  }

  function resetForm() { setName(''); setType('personal'); setImportance('high'); setDeadline(''); setShowForm(false); }

  function shelveGoal(id: string) {
    const updated = goals.map(g => g.id === id ? { ...g, status: 'shelved' as const } : g);
    setGoals(updated); saveGoals(updated);
  }

  function activateGoal(id: string) {
    if (active.length >= MAX_ACTIVE) return;
    const updated = goals.map(g => g.id === id ? { ...g, status: 'active' as const } : g);
    setGoals(updated); saveGoals(updated);
  }

  function getInput(goalId: string) {
    return newTaskInputs[goalId] ?? { name: '', abcde: 'B' as ABCDERank, urgent: false, isFrog: false, timeBlock: '' };
  }

  function setInput(goalId: string, patch: Partial<ReturnType<typeof getInput>>) {
    setNewTaskInputs(prev => ({ ...prev, [goalId]: { ...getInput(goalId), ...patch } }));
  }

  function addTask(goalId: string) {
    const inp = getInput(goalId);
    if (!inp.name.trim()) return;
    const task: Task = { id: uid(), goalId, name: inp.name.trim(), urgent: inp.urgent, abcde: inp.abcde, isFrog: inp.isFrog, timeBlock: inp.timeBlock || undefined, completedDates: [] };
    const updated = [...tasks, task]; setTasks(updated); saveTasks(updated);
    setInput(goalId, { name: '', abcde: 'B', urgent: false, isFrog: false, timeBlock: '' });
  }

  function deleteTask(id: string) {
    const updated = tasks.filter(t => t.id !== id); setTasks(updated); saveTasks(updated);
  }

  function toggleFrog(taskId: string) {
    const updated = tasks.map(t => ({ ...t, isFrog: t.id === taskId ? !t.isFrog : false }));
    setTasks(updated); saveTasks(updated);
  }

  const ABCDE_COLORS: Record<string, string> = { A: 'var(--signal)', B: '#F5A623', C: 'var(--text-muted)', D: '#555', E: '#444' };

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
          <input className="form-input" placeholder="Goal name" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div className="form-row">
            <select className="form-select" value={type} onChange={e => setType(e.target.value as GoalType)}>
              <option value="fitness">Fitness</option>
              <option value="career">Career</option>
              <option value="personal">Personal</option>
              <option value="mixed">Mixed</option>
            </select>
            <div className="importance-group">
              {(['high', 'medium', 'low'] as Importance[]).map(i => (
                <button key={i} className={`importance-btn${importance === i ? ' importance-btn--active' : ''}`} onClick={() => setImportance(i)}>{i}</button>
              ))}
            </div>
          </div>
          <input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          <div className="form-actions">
            <button className="btn-signal" onClick={handleAddGoal} disabled={!name.trim()}>Save</button>
            <button className="btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {overflowGoal && (
        <div className="overflow-prompt">
          <p className="overflow-text">You have 5 active goals. Swap one out or add "{overflowGoal.name}" to the waiting list.</p>
          <button className="btn-ghost" onClick={() => resolveOverflow('wait')}>Add to waiting list</button>
          <ul className="overflow-swap-list">
            {active.map(g => (
              <li key={g.id}>
                <button className="overflow-swap-btn" onClick={() => resolveOverflow('swap', g.id)}>
                  Shelve "{g.name}" → activate "{overflowGoal.name}"
                </button>
              </li>
            ))}
          </ul>
          <button className="btn-ghost" onClick={() => { setOverflowGoal(null); resetForm(); }}>Cancel</button>
        </div>
      )}

      {active.length === 0 && !showForm && <p className="goals-empty">No active goals. Add your first one.</p>}

      <ul className="goal-list">
        {active.map(goal => {
          const goalTasks = tasks.filter(t => t.goalId === goal.id);
          const inp = getInput(goal.id);
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

              {goalTasks.length > 0 && (
                <ul className="task-items">
                  {goalTasks.map(t => (
                    <li key={t.id} className="task-item">
                      <span className="task-item-abcde" style={{ color: ABCDE_COLORS[t.abcde] }}>{t.abcde}</span>
                      <span className="task-item-name">{t.name}{t.timeBlock ? ` — ${t.timeBlock}` : ''}</span>
                      <div className="task-item-actions">
                        {t.urgent && <span className="urgent-badge urgent-badge--sm">urgent</span>}
                        <button className={`frog-toggle${t.isFrog ? ' frog-toggle--active' : ''}`} onClick={() => toggleFrog(t.id)} title="Eat That Frog">🐸</button>
                        <button className="task-delete" onClick={() => deleteTask(t.id)}>×</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="task-add-area">
                <div className="task-add-row">
                  <input className="form-input form-input--sm" placeholder="Add a task..." value={inp.name} onChange={e => setInput(goal.id, { name: e.target.value })} onKeyDown={e => e.key === 'Enter' && addTask(goal.id)} />
                  <input className="form-input form-input--sm form-input--time" type="time" value={inp.timeBlock} onChange={e => setInput(goal.id, { timeBlock: e.target.value })} title="Time block" />
                </div>
                <div className="task-add-controls">
                  <div className="abcde-group">
                    {(['A','B','C','D','E'] as ABCDERank[]).map(r => (
                      <button key={r} title={ABCDE_DESC[r]} className={`abcde-btn${inp.abcde === r ? ' abcde-btn--active' : ''}`} onClick={() => setInput(goal.id, { abcde: r })}>{r}</button>
                    ))}
                  </div>
                  <label className="toggle-label"><input type="checkbox" checked={inp.urgent} onChange={e => setInput(goal.id, { urgent: e.target.checked })} /> Urgent</label>
                  <label className="toggle-label"><input type="checkbox" checked={inp.isFrog} onChange={e => setInput(goal.id, { isFrog: e.target.checked })} /> 🐸</label>
                  <button className="btn-signal btn-sm" onClick={() => addTask(goal.id)} disabled={!inp.name.trim()}>Add</button>
                </div>
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
                <button className="btn-ghost btn-sm" onClick={() => activateGoal(g.id)} disabled={active.length >= MAX_ACTIVE}>
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
