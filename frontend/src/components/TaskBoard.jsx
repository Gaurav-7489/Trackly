import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import "./Taskboard.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isoFromWeekday(weekStart, index) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + index);
  return d.toISOString().slice(0, 10);
}

export default function TaskBoard() {
  const {
    tasks,
    entriesByDate,
    weekStart,
    toggleStatus,
    addTask,
    deleteTask,
    loading,
  } = useTasks();

  const [newTask, setNewTask] = useState("");

  if (loading) {
    return (
      <section className="task-board">
        <p className="task-loading">Loading weekly tasks…</p>
      </section>
    );
  }

  function handleAdd() {
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask("");
  }

  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <section className="task-board">
      <h2 className="task-title-main">Weekly Tasks</h2>

      {/* ADD TASK */}
      <div className="task-add">
        <input
          placeholder="+ Add task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* TODAY */}
      <div className="task-today">
        <h3 className="section-title">Today</h3>

        {tasks.map((task) => {
          const entry =
            entriesByDate[todayISO]?.find(
              (e) => e.task.id === task.id
            );

          if (!entry) return null;

          return (
            <div key={task.id} className="today-row">
              <span>{task.title}</span>

              <div className="today-actions">
                <button
                  onClick={() =>
                    toggleStatus(task.id, todayISO, "done")
                  }
                >
                  Done
                </button>
                <button
                  className="lazy-btn"
                  onClick={() =>
                    toggleStatus(task.id, todayISO, "skipped")
                  }
                >
                  Skip
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* WEEKLY OVERVIEW */}
      <div className="task-grid">
        <h3 className="section-title">Weekly overview</h3>

        <div className="grid-header nice">
          <span />
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
          <span />
        </div>

        {tasks.map((task) => (
          <div key={task.id} className="grid-row nice">
            <span className="task-name">{task.title}</span>

            {DAYS.map((_, i) => {
              const iso = isoFromWeekday(weekStart, i);
              const entry =
                entriesByDate[iso]?.find(
                  (e) => e.task.id === task.id
                );

              const status = entry?.status;

              return (
                <span
                  key={iso}
                  className={`cell ${status}`}
                >
                  {status === "done" && "✔"}
                  {status === "skipped" && "😴"}
                  {status === "missed" && "✖"}
                  {!status && "☐"}

                </span>
              );
            })}

            <button
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
