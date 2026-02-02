import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

export default function Blackboard() {
  const { user } = useAuth();
  const { weekStart } = useTasks();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef(null);
  const noteId = useRef(null);

  // load weekly note
  useEffect(() => {
    if (!user) return;

    async function loadNote() {
      setLoading(true);

      const { data, error } = await supabase
        .from("weekly_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .single();

      if (data) {
        noteId.current = data.id;
        setContent(data.content || "");
      } else {
        noteId.current = null;
        setContent("");
      }

      setLoading(false);
    }

    loadNote();
  }, [user, weekStart]);

  // autosave (debounced)
  useEffect(() => {
    if (loading || !user) return;

    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      if (noteId.current) {
        await supabase
          .from("weekly_notes")
          .update({
            content,
            updated_at: new Date(),
          })
          .eq("id", noteId.current);
      } else {
        const { data } = await supabase
          .from("weekly_notes")
          .insert({
            user_id: user.id,
            week_start: weekStart,
            content,
          })
          .select()
          .single();

        if (data) noteId.current = data.id;
      }
    }, 800); // debounce 800ms
  }, [content, loading, user, weekStart]);

  if (!user) return null;
  if (loading) return <p>Loading blackboard...</p>;

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "16px",
        background: "#0f0f0f",
        borderRadius: "12px",
        color: "#fff",
      }}
    >
      <b>🧠 Blackboard</b>
      <small style={{ display: "block", opacity: 0.7 }}>
        Week of {weekStart}
      </small>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Dump thoughts, plans, regrets..."
        style={{
          width: "100%",
          minHeight: "140px",
          marginTop: "10px",
          background: "#111",
          color: "#fff",
          border: "1px solid #222",
          borderRadius: "8px",
          padding: "10px",
          resize: "vertical",
        }}
      />
    </div>
  );
}
