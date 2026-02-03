import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
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



export default function ProgressGraph() {
    const { user } = useAuth();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!user) return;

        async function fetchStats() {
            const { data: tasks, error } = await supabase
                .from("tasks")
                .select("status, created_at")
                .eq("user_id", user.id);

            if (error) {
                console.error(error);
                return;
            }

            // group by date
            const map = {};

            tasks.forEach((task) => {
                const date = new Date(task.created_at).toLocaleDateString();

                if (!map[date]) {
                    map[date] = { date, done: 0, missed: 0 };
                }

                const created = new Date(task.created_at);
                const today = new Date();

                if (task.status === "done") {
                    map[date].done += 1;
                }

                if (
                    task.status === "pending" &&
                    created.toDateString() !== today.toDateString()
                ) {
                    map[date].missed += 1;
                }

            });

            setData(Object.values(map));
        }

        fetchStats();
    }, [user]);

    if (data.length === 0) return <p>No progress data yet.</p>;

    return (
        <div style={{ width: "100%", height: 320, marginTop: "40px" }}>
  <h3 style={{ marginBottom: "12px" }}>Progress</h3>
 



            <ResponsiveContainer>
                <BarChart data={data} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="done" fill="#4caf50" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="missed" fill="#f44336" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}
