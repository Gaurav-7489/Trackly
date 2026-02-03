import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import "./Taskboard.css";


export default function TaskBoard() {
  const {
    weeklyTasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    weekStart,
  } = useTasks();

  const [newTask, setNewTask] = useState("");

  if (loading) return <p className="task-loading">Loading weekly tasks…</p>;

  function handleAdd() {
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask("");
  }

  return (
    <section className="task-board">
      <div className="task-header">
        <h2>Weekly Tasks</h2>
        <span className="week-label">Week of {weekStart}</span>
      </div>

      <div className="task-add">
        <input
          placeholder="Add a task for this week…"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {weeklyTasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Start small.</p>
      ) : (
        <ul className="task-list">
          {weeklyTasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.checked ? "done" : ""}`}
            >
              <label className="task-check">
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => toggleTask(task.id, task.checked)}
                />
                <span />
              </label>


              <span className="task-title">{task.title}</span>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
