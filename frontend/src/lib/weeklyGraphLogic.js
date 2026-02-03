// src/lib/weeklyGraphLogic.js

export function buildWeeklyGraph(entries = []) {
  if (!Array.isArray(entries)) return [];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const map = {};
  days.forEach((d) => {
    map[d] = {
      day: d,
      done: 0,
      skipped: 0, // 👈 lazy lives here
      missed: 0,
    };
  });

  for (const e of entries) {
    if (!e || !e.entry_date || !e.status) continue;
    if (e.status === "pending") continue;

    const date = new Date(e.entry_date);
    const index = (date.getDay() + 6) % 7; // Monday = 0
    const label = days[index];

    if (e.status === "done") map[label].done += 1;
    if (e.status === "skipped") map[label].skipped += 1; // 👈 NEW
    if (e.status === "missed") map[label].missed += 1;
  }

  return days.map((d) => map[d]);
}
