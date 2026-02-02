import { useEffect, useRef, useState } from "react";

function TimeScroller({ max, value, onChange }) {
  return (
    <div style={scroller}>
      {[...Array(max + 1).keys()].map((n) => (
        <div
          key={n}
          onClick={() => onChange(n)}
          style={{
            padding: "6px 0",
            textAlign: "center",
            cursor: "pointer",
            fontSize: value === n ? "18px" : "14px",
            color: value === n ? "#fff" : "#777",
            fontWeight: value === n ? "bold" : "normal",
          }}
        >
          {n.toString().padStart(2, "0")}
        </div>
      ))}
    </div>
  );
}

export default function Reminder() {
  const [message, setMessage] = useState("");
  const [h, setH] = useState(0);
  const [m, setM] = useState(5);
  const [s, setS] = useState(0);

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
    const total = h * 3600 + m * 60 + s;
    if (!message.trim() || total === 0) return;
    setTimeLeft(total);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setTimeLeft(null);
  }

  const rh = timeLeft ? Math.floor(timeLeft / 3600) : 0;
  const rm = timeLeft ? Math.floor((timeLeft % 3600) / 60) : 0;
  const rs = timeLeft ? timeLeft % 60 : 0;

  return (
    <div style={box}>
      <b>⏰ Reminder</b>

      <input
        placeholder="What should I remind you about?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={input}
      />

      {/* scrollers */}
      <div style={timeRow}>
        <div>
          <small>Hours</small>
          <TimeScroller max={6} value={h} onChange={setH} />
        </div>
        <div>
          <small>Minutes</small>
          <TimeScroller max={59} value={m} onChange={setM} />
        </div>
        <div>
          <small>Seconds</small>
          <TimeScroller max={59} value={s} onChange={setS} />
        </div>
      </div>

      {/* countdown */}
      {timeLeft !== null && (
        <p style={{ marginTop: "10px" }}>
          ⏳ {rh}h {rm}m {rs}s
        </p>
      )}

      {/* controls */}
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        {!running ? (
          <button onClick={start}>Start</button>
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

const box = {
  padding: "14px",
  background: "#111",
  borderRadius: "12px",
  color: "#fff",
};

const input = {
  width: "100%",
  padding: "6px",
  marginTop: "8px",
  background: "#000",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: "6px",
};

const timeRow = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "12px",
};

const scroller = {
  height: "120px",
  overflowY: "auto",
  width: "60px",
  background: "#000",
  borderRadius: "6px",
  border: "1px solid #333",
};
