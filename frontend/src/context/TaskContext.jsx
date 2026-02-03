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

const TaskContext = createContext();

function toISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getWeekRange(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;

  const start = new Date(d);
  start.setDate(d.getDate() - day + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: toISO(start),
    end: toISO(end),
  };
}

/* 🔥 STREAK LOGIC (pure function) */
function calculateStreak(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) return 0;

  const byDate = {};

  for (const e of entries) {
    if (!byDate[e.entry_date]) byDate[e.entry_date] = [];
    byDate[e.entry_date].push(e);
  }

  const dates = Object.keys(byDate).sort((a, b) =>
    b.localeCompare(a)
  );

  let streak = 0;

  for (const date of dates) {
    const dayEntries = byDate[date];

    const hasMissed = dayEntries.some(
      (e) => e.status === "missed"
    );
    const hasDone = dayEntries.some(
      (e) => e.status === "done"
    );

    if (hasMissed) break;
    if (hasDone) streak++;
    else break;
  }

  return streak;
}

export function TaskProvider({ children }) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { start: weekStart, end: weekEnd } = useMemo(
    () => getWeekRange(),
    []
  );

  /* 🔹 LOAD DATA */
  useEffect(() => {
    if (!user) {
      setLoading(true);
      return;
    }

    async function loadData() {
      setLoading(true);

      // 1️⃣ tasks
      const { data: taskData, error: taskErr } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");

      if (taskErr) {
        console.error(taskErr);
        setLoading(false);
        return;
      }

      // 2️⃣ entries
      const { data: entryData, error: entryErr } = await supabase
        .from("task_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", weekStart)
        .lte("entry_date", weekEnd);

      if (entryErr) {
        console.error(entryErr);
        setLoading(false);
        return;
      }

      // 2.5️⃣ mark yesterday missed
      const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 2);


      const yISO = toISO(yesterday);

      const pendingYesterday = entryData.filter(
        (e) =>
          e.entry_date === yISO && e.status === "pending"
      );

      if (pendingYesterday.length > 0) {
        await supabase
          .from("task_entries")
          .update({ status: "missed" })
          .in(
            "id",
            pendingYesterday.map((e) => e.id)
          );

        pendingYesterday.forEach((e) => {
          e.status = "missed";
        });
      }

      // 3️⃣ ensure today
      const today = toISO();
      const existingToday = new Set(
        entryData
          .filter((e) => e.entry_date === today)
          .map((e) => e.task_id)
      );

      const missing = taskData.filter(
        (t) => !existingToday.has(t.id)
      );

      if (missing.length > 0) {
        const inserts = missing.map((t) => ({
          user_id: user.id,
          task_id: t.id,
          entry_date: today,
          status: "pending",
        }));

        const { data: newEntries } = await supabase
          .from("task_entries")
          .insert(inserts)
          .select();

        if (newEntries) entryData.push(...newEntries);
      }

      setTasks(taskData);
      setEntries(entryData);
      setLoading(false);
    }

    loadData();
  }, [user, weekStart, weekEnd]);

  /* 🔹 STREAK (memoized, SAFE) */
  const currentStreak = useMemo(() => {
    return calculateStreak(entries);
  }, [entries]);

  /* 🔹 ACTIONS */
  const toggleStatus = useCallback(
    async (taskId, date = toISO(), forceStatus) => {
      if (!user) return;

      const entry = entries.find(
        (e) =>
          e.task_id === taskId && e.entry_date === date
      );
      if (!entry) return;

      const next =
        forceStatus ??
        (entry.status === "pending"
          ? "done"
          : entry.status === "done"
            ? "skipped"
            : "pending");

      await supabase
        .from("task_entries")
        .update({ status: next })
        .eq("id", entry.id);

      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, status: next } : e
        )
      );
    },
    [entries, user]
  );

  const addTask = useCallback(
    async (title) => {
      if (!user || !title.trim()) return;

      const { data } = await supabase
        .from("tasks")
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (!data) return;

      setTasks((p) => [...p, data]);

      const { data: entry } = await supabase
        .from("task_entries")
        .insert({
          user_id: user.id,
          task_id: data.id,
          entry_date: toISO(),
          status: "pending",
        })
        .select()
        .single();

      if (entry) setEntries((p) => [...p, entry]);
    },
    [user]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) return;

      await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      setTasks((p) => p.filter((t) => t.id !== taskId));
      setEntries((p) =>
        p.filter((e) => e.task_id !== taskId)
      );
    },
    [user]
  );

  const entriesByDate = useMemo(() => {
    const map = {};
    for (const e of entries) {
      if (!map[e.entry_date]) map[e.entry_date] = [];
      const task = tasks.find((t) => t.id === e.task_id);
      if (task) map[e.entry_date].push({ ...e, task });
    }
    return map;
  }, [entries, tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        entries,
        entriesByDate,
        currentStreak,
        loading,
        weekStart,
        weekEnd,
        toggleStatus,
        addTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
