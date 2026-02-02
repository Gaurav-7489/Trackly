import { useEffect, useState } from "react";

export default function FocusTimer() {
  const [mode, setMode] = useState("focus"); // focus | free
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [now, setNow] = useState(new Date());

  // live clock
  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // timer logic
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (mode === "focus") {
          if (s <= 1) {
            setRunning(false);
            return 25 * 60;
          }
          return s - 1;
        } else {
          // free mode = stopwatch
          return s + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode]);

  function reset() {
    setRunning(false);
    setSeconds(mode === "focus" ? 25 * 60 : 0);
  }

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={box}>
      {/* clock */}
      <div style={{ fontSize: "12px", opacity: 0.7 }}>
        {now.toLocaleTimeString()}
      </div>

      <b style={{ display: "block", marginTop: "6px" }}>
        {mode === "focus" ? "⏱ Focus Timer" : "⏲ Free Study"}
      </b>

      <p style={{ fontSize: "28px", margin: "10px 0" }}>
        {minutes}:{secs.toString().padStart(2, "0")}
      </p>

      {/* controls */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>

        <button onClick={reset}>Reset</button>
      </div>

      {/* mode switch */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => {
            setMode("focus");
            setSeconds(25 * 60);
            setRunning(false);
          }}
          disabled={mode === "focus"}
        >
          Focus
        </button>

        <button
          onClick={() => {
            setMode("free");
            setSeconds(0);
            setRunning(false);
          }}
          disabled={mode === "free"}
          style={{ marginLeft: "6px" }}
        >
          Free
        </button>
      </div>
    </div>
  );
}

const box = {
  padding: "14px",
  background: "#111",
  borderRadius: "12px",
  color: "#fff",
  textAlign: "center",
};
