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
import "./WeeklyProgressGraph.css";

export default function WeeklyProgressGraph() {
  const { weeklyTasks, weekStart, loading } = useTasks();

  if (loading) return null;

  const data = buildWeeklyGraph(weeklyTasks, weekStart);

  return (
    <section className="weekly-graph">
      <div className="graph-header">
        <h3>Weekly Progress</h3>
        <span className="graph-sub">
          Week of {weekStart}
        </span>
      </div>

      <div className="graph-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis
              dataKey="day"
              stroke="#888"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              stroke="#888"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="done" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="missed" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
