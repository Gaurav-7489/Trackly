import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { calculateStreak } from "../lib/streakLogic";


export default function StreakCounter() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("status, created_at")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      setStreak(calculateStreak(data));
    }

    fetchTasks();
  }, [user]);

  if (!user) return null;

  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "10px",
        background: "#111",
        color: "#fff",
        maxWidth: "260px",
      }}
    >
      <b>🔥 Streak</b>
      <p style={{ fontSize: "22px", marginTop: "6px" }}>
        {streak} day{streak === 1 ? "" : "s"}
      </p>
    </div>
  );
}
