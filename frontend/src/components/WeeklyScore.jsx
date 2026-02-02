import { useTasks } from "../context/TaskContext";
import { calculateWeeklyScore } from "../lib/weeklyScoreLogic";

export default function WeeklyScore() {
  const { weeklyTasks, weekStart, loading } = useTasks();

  if (loading) return null;

  const score = calculateWeeklyScore(weeklyTasks);

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "14px",
        borderRadius: "12px",
        background: "#111",
        color: "#fff",
        maxWidth: "300px",
      }}
    >
      <b>Weekly Score</b>
      <p style={{ fontSize: "26px", margin: "8px 0" }}>
        {score}%
      </p>
      <small>Week starting {weekStart}</small>
    </div>
  );
}
