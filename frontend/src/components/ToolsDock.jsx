import "./ToolsDock.css";

export default function ToolsDock({ onOpen }) {
  return (
    <div className="tools-mini">
      <button onClick={() => onOpen("focus")} title="Focus Timer">⏱</button>
      <button onClick={() => onOpen("reminder")} title="Reminder">⏰</button>
      <button onClick={() => onOpen("calc")} title="Calculator">🧮</button>
      <button onClick={() => onOpen("board")} title="Blackboard">🧠</button>
    </div>
  );
}
