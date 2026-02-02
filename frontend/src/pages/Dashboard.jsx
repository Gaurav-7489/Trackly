import { useState, lazy, Suspense } from "react";

import Header from "../components/Header";
import WeeklyScore from "../components/WeeklyScore";
import TaskBoard from "../components/TaskBoard";
import WeeklyProgressGraph from "../components/WeeklyProgressGraph";
import RoastBot from "../components/RoastBot";

import ToolsDock from "../components/ToolsDock";
import ToolModal from "../components/ToolModal";

// lazy-loaded tools (loaded ONLY when opened)
const FocusTimer = lazy(() => import("../components/Tools/FocusTimer"));
const Reminder = lazy(() => import("../components/Tools/Reminder"));
const Calculator = lazy(() => import("../components/Tools/Calculator"));
const BlackboardTool = lazy(() => import("../components/Tools/Blackboard"));

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <>
      <Header />

      <div style={{ padding: "20px", paddingBottom: "80px" }}>
        <WeeklyScore />
        <TaskBoard />
        <WeeklyProgressGraph />
        <RoastBot />
      </div>

      {/* Bottom dock */}
      <ToolsDock onOpen={setActiveTool} />

      {/* Tool popup */}
      <ToolModal open={activeTool} onClose={() => setActiveTool(null)}>
        <Suspense fallback={<p style={{ color: "#fff" }}>Loading tool…</p>}>
          {activeTool === "focus" && <FocusTimer />}
          {activeTool === "reminder" && <Reminder />}
          {activeTool === "calc" && <Calculator />}
          {activeTool === "board" && <BlackboardTool />}
        </Suspense>
      </ToolModal>
    </>
  );
}
