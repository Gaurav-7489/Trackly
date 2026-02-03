import { useState, lazy, Suspense } from "react";
import Header from "../components/Header";
import WeeklyScore from "../components/WeeklyScore";
import TaskBoard from "../components/TaskBoard";
import WeeklyProgressGraph from "../components/WeeklyProgressGraph";
import RoastBot from "../components/RoastBot";
import ToolsDock from "../components/ToolsDock";
import ToolModal from "../components/ToolModal";
import "./Dashboard.css";

// lazy tools
const FocusTimer = lazy(() => import("../components/Tools/FocusTimer"));
const Reminder = lazy(() => import("../components/Tools/Reminder"));
const Calculator = lazy(() => import("../components/Tools/Calculator"));
const BlackboardTool = lazy(() => import("../components/Tools/Blackboard"));

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <>
      <Header />

      <div className="dashboard">
        {/* TOP */}
        <div className="dashboard-top">
          <div className="welcome">
            <h1>Welcome back</h1>
            <p>Let’s make this week count.</p>
          </div>

          <RoastBot />
        </div>

        {/* 50 / 50 */}
        <div className="dashboard-stats">
          <WeeklyScore />
          <WeeklyProgressGraph />
        </div>

        {/* TASKS */}
        <TaskBoard />
      </div>

      <ToolsDock onOpen={setActiveTool} />

      <ToolModal
        open={activeTool}
        onClose={() => setActiveTool(null)}
        variant={activeTool === "board" ? "blackboard" : "default"}
      >
        <Suspense fallback={<p>Loading…</p>}>
          {activeTool === "focus" && <FocusTimer />}
          {activeTool === "reminder" && <Reminder />}
          {activeTool === "calc" && <Calculator />}
          {activeTool === "board" && <BlackboardTool />}
        </Suspense>
      </ToolModal>

    </>
  );
}
