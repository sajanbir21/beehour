import { useState, useEffect } from 'react';
import type { Habit, Goal } from '../types';
import { loadHabits, saveHabits, loadGoals } from '../utils/storage';
import { todayISO, getLast7Days, formatDayLetter, getStreak } from '../utils/date';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [goalId, setGoalId] = useState('');
  const [freq, setFreq] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => { setHabits(loadHabits()); setGoals(loadGoals()); }, []);

  const today = todayISO();
  const week = getLast7Days();
  const activeGoals = goals.filter(g => g.status === 'active');

  function toggle(habitId: string) {
    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      const done = h.completedDates.includes(today);
      return { ...h, completedDates: done ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today] };
    });
    setHabits(updated); saveHabits(updated);
  }

  function addHabit() {
    if (!name.trim()) return;
    const h: Habit = { id: uid(), name: name.trim(), goalId: goalId || undefined, frequency: freq, completedDates: [], createdAt: new Date().toISOString() };
    const updated = [...habits, h]; setHabits(updated); saveHabits(updated);
    setName(''); setGoalId(''); setFreq('daily'); setShowForm(false);
  }

  function deleteHabit(id: string) {
    const updated = habits.filter(h => h.id !== id); setHabits(updated); saveHabits(updated);
  }

  const goalMap = new Map(goals.map(g => [g.id, g]));

  return (
    <div className="habits-page">
      <div className="goals-header">
        <h1 className="page-heading">Habits</h1>
        {!showForm && <button className="btn-signal" onClick={() => setShowForm(true)}>+ Add habit</button>}
      </div>

      {showForm && (
        <div className="goal-form">
          <input className="form-input" placeholder="Habit name (e.g. Morning workout)" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div className="form-row">
            <select className="form-select" value={goalId} onChange={e => setGoalId(e.target.value)}>
              <option value="">No linked goal</option>
              {activeGoals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <div className="importance-group">
              {(['daily', 'weekly'] as const).map(f => (
                <button key={f} className={`importance-btn${freq === f ? ' importance-btn--active' : ''}`} onClick={() => setFreq(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-signal" onClick={addHabit} disabled={!name.trim()}>Save</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {habits.length === 0 && !showForm && (
        <p className="goals-empty">No habits yet. Build consistency by adding your first one.</p>
      )}

      <ul className="habit-list">
        {habits.map(h => {
          const streak = getStreak(h.completedDates);
          const doneToday = h.completedDates.includes(today);
          const linkedGoal = h.goalId ? goalMap.get(h.goalId) : null;
          return (
            <li key={h.id} className="habit-card">
              <div className="habit-top">
                <div className="habit-info">
                  <button className={`habit-check${doneToday ? ' habit-check--done' : ''}`} onClick={() => toggle(h.id)}>
                    {doneToday ? '✓' : ''}
                  </button>
                  <div>
                    <span className="habit-name">{h.name}</span>
                    {linkedGoal && <span className="habit-goal">{linkedGoal.name}</span>}
                  </div>
                </div>
                <div className="habit-right">
                  <span className="streak-count">{streak > 0 ? `🔥 ${streak}` : '—'}</span>
                  <button className="task-delete" onClick={() => deleteHabit(h.id)}>×</button>
                </div>
              </div>
              <div className="habit-week">
                {week.map(d => (
                  <div key={d} className="habit-day">
                    <span className="habit-day-label">{formatDayLetter(d)}</span>
                    <span className={`habit-dot${h.completedDates.includes(d) ? ' habit-dot--done' : ''}`} />
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
