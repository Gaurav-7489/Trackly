export function getRoast({ done, pending, missed }) {
  // nothing done
  if (done === 0 && missed > 0) {
    return "Zero tasks done. Outstanding commitment to procrastination.";
  }

  // pure laziness
  if (done === 0 && pending > 0) {
    return "You planned tasks just to emotionally abandon them.";
  }

  // more missed than done
  if (missed > done) {
    return "You miss more tasks than you complete. Impressive consistency.";
  }

  // average day
  if (done > 0 && done <= 2) {
    return "Bare minimum achieved. Don’t celebrate yet.";
  }

  // good day
  if (done >= 3 && missed === 0) {
    return "Rare W detected. Screenshot this before it disappears.";
  }

  // god mode
  if (done >= 5 && missed === 0) {
    return "Who are you and what did you do with the old you?";
  }

  // fallback
  return "Existence detected. Productivity questionable.";
}
