import { useRef, useState, useEffect } from "react";
import "./Blackboard.css";

export default function Blackboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("var(--text)");
  const [lineWidth, setLineWidth] = useState(0.35);
  const [mode, setMode] = useState("draw");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.globalCompositeOperation =
      mode === "erase" ? "destination-out" : "source-over";
  }, [color, lineWidth, mode]);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches?.[0];
    return {
      x: (t?.clientX ?? e.clientX) - rect.left,
      y: (t?.clientY ?? e.clientY) - rect.top,
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
    setDrawing(false);
    ctxRef.current.closePath();
  }

  function clearBoard() {
    const c = canvasRef.current;
    ctxRef.current.clearRect(0, 0, c.width, c.height);
  }

  return (
    <section className="bb-root">
      <header className="bb-toolbar">
        <div className="bb-group">
          <button onClick={() => setColor("var(--text)")}>✏️</button>
          <button onClick={() => setColor("#ff4444")}>🔴</button>
          <button onClick={() => setColor("#00cc66")}>🟢</button>
        </div>

        <div className="bb-group">
          <button onClick={() => setMode("draw")}>Draw</button>
          <button onClick={() => setMode("erase")}>Erase</button>
        </div>

        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        >
          <option value={0.2}>Thin</option>
          <option value={0.35}>Normal</option>
          <option value={0.6}>Thick</option>
        </select>

        <button onClick={clearBoard}>Clear</button>
      </header>

      <div className="bb-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="bb-canvas"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </section>
  );
}
