export function calculateConsistency(tasks, days = 7) {
  const today = new Date();
  const byDate = {};

  // initialize last N days
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    byDate[d.toDateString()] = { done: 0, missed: 0 };
  }

  tasks.forEach((task) => {
    const taskDate = new Date(task.created_at).toDateString();
    const created = new Date(task.created_at);

    if (!byDate[taskDate]) return;

    if (task.status === "done") {
      byDate[taskDate].done += 1;
    }

    if (
      task.status === "pending" &&
      created.toDateString() !== today.toDateString()
    ) {
      byDate[taskDate].missed += 1;
    }
  });

  let goodDays = 0;
  let totalDays = Object.keys(byDate).length;

  Object.values(byDate).forEach((day) => {
    if (day.done > 0 && day.missed === 0) {
      goodDays += 1;
    }
  });

  return Math.round((goodDays / totalDays) * 100);
}
