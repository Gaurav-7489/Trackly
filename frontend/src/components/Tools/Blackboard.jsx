import { useRef, useState, useEffect } from "react";

export default function Blackboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#00ff00"); // default green
  const [lineWidth, setLineWidth] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = 350;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
  }, [color, lineWidth]);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  }

  function startDraw(e) {
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setDrawing(true);
  }

  function draw(e) {
    if (!drawing) return;
    const { x, y } = getPos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  }

  function stopDraw() {
    ctxRef.current.closePath();
    setDrawing(false);
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div style={box}>
      <b>🧑‍🏫 Blackboard</b>

      <div style={toolbar}>
        <button onClick={() => setColor("#00ff00")}>🟢</button>
        <button onClick={() => setColor("#ffffff")}>⚪</button>
        <button onClick={() => setColor("#ff4444")}>🔴</button>
        <button onClick={() => setColor("#000000")}>🧽 Erase</button>

        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        >
          <option value={2}>Thin</option>
          <option value={4}>Normal</option>
          <option value={7}>Thick</option>
        </select>

        <button onClick={clearBoard}>Clear All</button>
      </div>

      <canvas
        ref={canvasRef}
        style={canvasStyle}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </div>
  );
}

const box = {
  background: "#111",
  padding: "12px",
  borderRadius: "12px",
  color: "#fff",
};

const toolbar = {
  display: "flex",
  gap: "8px",
  margin: "10px 0",
  flexWrap: "wrap",
};

const canvasStyle = {
  width: "100%",
  background: "#000",
  borderRadius: "8px",
  border: "1px solid #333",
  touchAction: "none",
};
