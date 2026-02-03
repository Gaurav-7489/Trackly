import { useTasks } from "../context/TaskContext";
import { calculateWeeklyScore } from "../lib/weeklyScoreLogic";
import "./WeeklyScore.css";

export default function WeeklyScore() {
  const { weeklyTasks, weekStart, loading } = useTasks();

  if (loading) return null;

  const score = calculateWeeklyScore(weeklyTasks);

  const level =
    score >= 80 ? "great" : score >= 50 ? "okay" : "low";

  return (
    <section className={`weekly-score ${level}`}>
      <div className="score-header">
        <span className="label">Weekly Score</span>
        <span className="week">Week of {weekStart}</span>
      </div>

      <div className="score-value">
        {score}
        <span>%</span>
      </div>

      <p className="score-hint">
        {score >= 80
          ? "Strong week. Keep momentum."
          : score >= 50
          ? "Decent progress. Room to push."
          : "Low activity. Start small."}
      </p>
    </section>
  );
}
