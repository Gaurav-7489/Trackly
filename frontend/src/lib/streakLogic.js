export function calculateStreak(tasks) {
  // group tasks by date
  const byDate = {};

  tasks.forEach((task) => {
    const date = new Date(task.created_at).toDateString();

    if (!byDate[date]) {
      byDate[date] = { done: 0, pending: 0 };
    }

    if (task.status === "done") byDate[date].done += 1;
    if (task.status === "pending") byDate[date].pending += 1;
  });

  let streak = 0;
  let day = new Date();

  // walk backwards day-by-day
  while (true) {
    const key = day.toDateString();
    const stats = byDate[key];

    if (!stats) break; // no activity = streak broken
    if (stats.done === 0) break; // did nothing
    if (stats.pending > 0) break; // missed tasks

    streak += 1;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}
