import { useTasks } from "../context/TaskContext";
import { buildWeeklyGraph } from "../lib/weeklyGraphLogic";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function WeeklyProgressGraph() {
  const { weeklyTasks, weekStart, loading } = useTasks();

  if (loading) return null;

  const data = buildWeeklyGraph(weeklyTasks, weekStart);

 return (
  <div style={{ marginTop: "30px" }}>
    <h3>Weekly Progress</h3>

    <div
      style={{
        width: "100%",
        height: "320px",
        minHeight: "320px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="done" fill="#4caf50" />
          <Bar dataKey="missed" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

}
