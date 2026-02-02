import { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");

  function input(val) {
    setDisplay((prev) =>
      prev === "0" ? val : prev + val
    );
  }

  function clear() {
    setDisplay("0");
  }

  function backspace() {
    setDisplay((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : "0"
    );
  }

  function calculate() {
    try {
      const result = Function(`"use strict"; return (${display})`)();
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  }

  return (
    <div style={box}>
      <div style={screen}>{display}</div>

      <div style={grid}>
        <Btn onClick={clear}>C</Btn>
        <Btn onClick={backspace}>⌫</Btn>
        <Btn onClick={() => input("%")}>%</Btn>
        <Btn onClick={() => input("/")}>÷</Btn>

        <Btn onClick={() => input("7")}>7</Btn>
        <Btn onClick={() => input("8")}>8</Btn>
        <Btn onClick={() => input("9")}>9</Btn>
        <Btn onClick={() => input("*")}>×</Btn>

        <Btn onClick={() => input("4")}>4</Btn>
        <Btn onClick={() => input("5")}>5</Btn>
        <Btn onClick={() => input("6")}>6</Btn>
        <Btn onClick={() => input("-")}>−</Btn>

        <Btn onClick={() => input("1")}>1</Btn>
        <Btn onClick={() => input("2")}>2</Btn>
        <Btn onClick={() => input("3")}>3</Btn>
        <Btn onClick={() => input("+")}>+</Btn>

        <Btn onClick={() => input("0")} wide>0</Btn>
        <Btn onClick={() => input(".")}>.</Btn>
        <Btn onClick={calculate}>=</Btn>
      </div>
    </div>
  );
}

function Btn({ children, onClick, wide }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...btn,
        gridColumn: wide ? "span 2" : "span 1",
      }}
    >
      {children}
    </button>
  );
}

const box = {
  background: "#111",
  padding: "16px",
  borderRadius: "12px",
  color: "#fff",
  width: "100%",
  maxWidth: "320px",
  margin: "0 auto",
};

const screen = {
  background: "#000",
  padding: "12px",
  fontSize: "24px",
  textAlign: "right",
  borderRadius: "8px",
  marginBottom: "12px",
  overflowX: "auto",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "8px",
};

const btn = {
  padding: "14px",
  fontSize: "18px",
  background: "#222",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
