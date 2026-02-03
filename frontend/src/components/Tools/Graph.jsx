export default function Graph({ expr }) {
  const points = [];

  const safeExpr = expr
    .replace(/sin/g, "Math.sin")
    .replace(/cos/g, "Math.cos")
    .replace(/tan/g, "Math.tan");

  const hasX = expr.includes("x");

  for (let x = -180; x <= 180; x += 1) {
    const rad = (x * Math.PI) / 180;

    try {
      // eslint-disable-next-line no-new-func
      const y = hasX
        ? Function("x", `return ${safeExpr}`)(rad)
        : Function(`return ${safeExpr}`)();

      if (Number.isFinite(y) && Math.abs(y) < 10) {
        const px = x + 180;
        const py = 90 - y * 15;
        points.push(`${px},${py}`);
      }
    } catch {
      // skip
    }
  }

  return (
    <div className="graph-box">
      <svg viewBox="0 0 360 180" className="graph-svg">
        <line x1="0" y1="90" x2="360" y2="90" />
        <line x1="180" y1="0" x2="180" y2="180" />

        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          points={points.join(" ")}
        />
      </svg>
    </div>
  );
}
