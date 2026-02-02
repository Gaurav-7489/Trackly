import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { getWeekStart } from "../lib/weekUtils";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user } = useAuth();

  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekStart] = useState(getWeekStart());

  // 🔹 fetch weekly tasks (only when user/week changes)
  useEffect(() => {
    if (!user) return;

    async function fetchWeeklyTasks() {
      setLoading(true);

      const { data, error } = await supabase
        .from("weekly_tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("fetchWeeklyTasks:", error);
      } else {
        setWeeklyTasks(data);
      }

      setLoading(false);
    }

    fetchWeeklyTasks();
  }, [user, weekStart]);

  // 🔹 add task (memoized)
  const addTask = useCallback(
    async (title) => {
      if (!user || !title.trim()) return;

      const { data, error } = await supabase
        .from("weekly_tasks")
        .insert({
          user_id: user.id,
          title,
          week_start: weekStart,
        })
        .select()
        .single();

      if (!error && data) {
        setWeeklyTasks((prev) => [...prev, data]);
      }
    },
    [user, weekStart]
  );

  // 🔹 toggle checkbox (memoized)
  const toggleTask = useCallback(
    async (id, checked) => {
      if (!user) return;

      const { error } = await supabase
        .from("weekly_tasks")
        .update({ checked: !checked })
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        setWeeklyTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, checked: !checked } : t
          )
        );
      }
    },
    [user]
  );

  // 🔹 delete task (memoized)
  const deleteTask = useCallback(
    async (id) => {
      if (!user) return;

      const { error } = await supabase
        .from("weekly_tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        setWeeklyTasks((prev) =>
          prev.filter((t) => t.id !== id)
        );
      }
    },
    [user]
  );

  // 🔹 memoized context value (BIG performance win)
  const value = useMemo(
    () => ({
      weeklyTasks,
      loading,
      addTask,
      toggleTask,
      deleteTask,
      weekStart,
    }),
    [weeklyTasks, loading, addTask, toggleTask, deleteTask, weekStart]
  );

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
