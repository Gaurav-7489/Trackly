// src/lib/weeklyScoreLogic.js

export function calculateWeeklyScore(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return 0;
  }

  let total = 0;
  let possible = 0;

  for (const e of entries) {
    // ignore future / pending
    if (!e || !e.status) continue;
    if (e.status === "pending") continue;

    possible += 1;

    if (e.status === "done") total += 1;
    if (e.status === "missed") total -= 1;
    // skipped = neutral
  }

  if (possible === 0) return 0;

  const percent = (total / possible) * 100;

  return Math.max(0, Math.round(percent));
}
