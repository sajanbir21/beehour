export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function startOfWeekISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}
