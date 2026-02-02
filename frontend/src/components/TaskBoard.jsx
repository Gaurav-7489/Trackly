import { useState } from "react";
import { useTasks } from "../context/TaskContext";

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

  if (loading) return <p>Loading weekly tasks...</p>;

  function handleAdd() {
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask("");
  }

  return (
    <div>
      <h2>
        Weekly Tasks <small>(week of {weekStart})</small>
      </h2>

      <div style={{ marginBottom: "12px" }}>
        <input
          placeholder="add weekly task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {weeklyTasks.length === 0 && (
        <p>No tasks for this week yet.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {weeklyTasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={task.checked}
              onChange={() =>
                toggleTask(task.id, task.checked)
              }
            />

            <span
              style={{
                marginLeft: "8px",
                textDecoration: task.checked
                  ? "line-through"
                  : "none",
                opacity: task.checked ? 0.6 : 1,
                flexGrow: 1,
              }}
            >
              {task.title}
            </span>

            <button
              onClick={() => deleteTask(task.id)}
              style={{
                marginLeft: "8px",
                color: "red",
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
