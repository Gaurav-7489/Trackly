import { useState } from "react";
import Graph from "./Graph";
import "./Calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [graphExpr, setGraphExpr] = useState(null);

  function smartAppend(prev, val) {
    const last = prev.slice(-1);

    if (
      (val === "x" && /[0-9)]/.test(last)) ||
      (val === "(" && /[0-9x)]/.test(last)) ||
      (/[0-9]/.test(val) && /[x)]/.test(last))
    ) {
      return prev + "*" + val;
    }

    return prev + val;
  }

  function input(val) {
    setDisplay((prev) => {
      const next = prev === "0" ? val : smartAppend(prev, val);
      setGraphExpr(next); // always graph what user types
      return next;
    });
  }

  function clear() {
    setDisplay("0");
    setGraphExpr(null);
  }

  function calculate() {
    try {
      const expr = display
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan");

      // eslint-disable-next-line no-new-func
      const result = Function(`return (${expr})`)();
      setDisplay(String(result));
      // ⛔ DO NOT clear graphExpr
    } catch {
      setDisplay("Error");
    }
  }

  return (
    <div className="calculator">
      <div className="calc-screen">{display}</div>

      {graphExpr && <Graph expr={graphExpr} />}

      <div className="sci-row">
        <button onClick={() => input("sin(")}>sin</button>
        <button onClick={() => input("cos(")}>cos</button>
        <button onClick={() => input("tan(")}>tan</button>
        <button onClick={() => input("x")}>x</button>
      </div>

      <div className="calc-grid">
        {["7","8","9","/","4","5","6","*","1","2","3","-","0","+","(",")"].map(
          (k) => (
            <button key={k} onClick={() => input(k)}>{k}</button>
          )
        )}

        <button className="btn-danger" onClick={clear}>C</button>
        <button className="btn-equal" onClick={calculate}>=</button>
      </div>
    </div>
  );
}
