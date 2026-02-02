import FocusTimer from "./FocusTimer";
import Reminder from "./Reminder";
import Calculator from "./Calculator";

export default function ToolsPanel() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginTop: "40px",
      }}
    >
      <FocusTimer />
      <Reminder />
      <Calculator />
    </div>
  );
}
