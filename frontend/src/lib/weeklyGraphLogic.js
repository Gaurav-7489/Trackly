const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function buildWeeklyGraph(weeklyTasks, weekStart) {
  const base = new Date(weekStart);
  const map = {};

  // init days
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const key = d.toDateString();

    map[key] = {
      day: DAYS[i],
      done: 0,
      missed: 0,
    };
  }

  weeklyTasks.forEach((t) => {
    const key = new Date(t.created_at).toDateString();
    if (!map[key]) return;

    if (t.checked) map[key].done += 1;
    else map[key].missed += 1;
  });

  return Object.values(map);
}
