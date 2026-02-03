import { useEffect, useRef, useState } from "react";
import "./FocusTimer.css";

const PRESETS = [25, 45, 60];

export default function FocusTimer() {
  const [mode, setMode] = useState("focus"); // focus | free
  const [duration, setDuration] = useState(25 * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [autoRestart, setAutoRestart] = useState(false);
  const [muted, setMuted] = useState(false);
  const [now, setNow] = useState(new Date());

  const alarmRef = useRef(null);

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
            if (!muted) alarmRef.current?.play();
            setSessions((c) => c + 1);
            setRunning(autoRestart);
            return duration;
          }
          return s - 1;
        } else {
          return s + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode, duration, autoRestart, muted]);

  function start() {
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setSeconds(mode === "focus" ? duration : 0);
  }

  function setPreset(min) {
    setMode("focus");
    setDuration(min * 60);
    setSeconds(min * 60);
    setRunning(false);
  }

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className={`focus-timer ${running ? "running" : ""}`}>
      <div className="clock">{now.toLocaleTimeString()}</div>

      <div className="title">
        {mode === "focus" ? "⏱ Focus Session" : "⏲ Free Study"}
      </div>

      <div className="time">
        {minutes}:{secs.toString().padStart(2, "0")}
      </div>

      {/* presets */}
      <div className="presets">
        {PRESETS.map((m) => (
          <button
            key={m}
            className={duration === m * 60 ? "active" : ""}
            onClick={() => setPreset(m)}
          >
            {m}m
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="controls">
        {!running ? (
          <button className="primary" onClick={start}>
            Start
          </button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}
        <button onClick={reset}>Reset</button>
      </div>

      {/* toggles */}
      <div className="toggles">
        <label>
          <input
            type="checkbox"
            checked={autoRestart}
            onChange={() => setAutoRestart(!autoRestart)}
          />
          Auto restart
        </label>

        <label>
          <input
            type="checkbox"
            checked={muted}
            onChange={() => setMuted(!muted)}
          />
          Mute alarm
        </label>
      </div>

      <div className="session-count">
        Sessions completed: <b>{sessions}</b>
      </div>

      <audio
        ref={alarmRef}
        src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
      />
    </div>
  );
}
