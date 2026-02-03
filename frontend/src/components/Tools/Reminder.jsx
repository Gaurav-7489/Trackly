import { useEffect, useRef, useState } from "react";
import "./Reminder.css";

export default function Reminder() {
  const [message, setMessage] = useState("");
  const [minutes, setMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!running || timeLeft === null) return;

    const i = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(i);
          setRunning(false);
          audioRef.current?.play();
          return null;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(i);
  }, [running, timeLeft]);

  function start() {
    if (!message.trim() || minutes === 0) return;
    setTimeLeft(minutes * 60);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setTimeLeft(null);
  }

  const m = timeLeft ? Math.floor(timeLeft / 60) : 0;
  const s = timeLeft ? timeLeft % 60 : 0;

  return (
    <div className="reminder">
      <div className="reminder-header">
        <span>⏰ Reminder</span>
      </div>

      <input
        className="reminder-input"
        placeholder="Remind me to…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* quick time picks */}
      <div className="time-pills">
        {[5, 10, 15, 25, 30, 60].map((t) => (
          <button
            key={t}
            className={minutes === t ? "active" : ""}
            onClick={() => setMinutes(t)}
          >
            {t}m
          </button>
        ))}
      </div>

      {/* countdown */}
      {timeLeft !== null && (
        <div className="countdown-big">
          {m}:{s.toString().padStart(2, "0")}
        </div>
      )}

      {/* actions */}
      <div className="actions">
        {!running ? (
          <button className="primary" onClick={start}>
            Start reminder
          </button>
        ) : (
          <button onClick={() => setRunning(false)}>Pause</button>
        )}
        <button onClick={reset}>Reset</button>
      </div>

      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />
    </div>
  );
}
