export function calculateWeeklyScore(tasks) {
  if (tasks.length === 0) return 0;

  const done = tasks.filter((t) => t.checked).length;
  return Math.round((done / tasks.length) * 100);
}
