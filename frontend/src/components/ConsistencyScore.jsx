import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { calculateConsistency } from "../lib/consistencyLogic";

export default function ConsistencyScore() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);

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

      setScore(calculateConsistency(data, 7));
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
      <b>📊 Consistency (7 days)</b>
      <p style={{ fontSize: "22px", marginTop: "6px" }}>
        {score}%
      </p>
    </div>
  );
}
