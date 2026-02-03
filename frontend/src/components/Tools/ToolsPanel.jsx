import FocusTimer from "./FocusTimer";
import Reminder from "./Reminder";
import Calculator from "./Calculator";
import "./ToolsPanel.css";

export default function ToolsPanel() {
  return (
    <section className="tools-panel">
      <FocusTimer />
      <Reminder />
      <Calculator />
    </section>
  );
}
